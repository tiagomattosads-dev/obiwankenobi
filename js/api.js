// ============================================================================
// API UNIFICADA NOCTURNE DYNAMICS — MESTRE KENOBI <-> SUPABASE DATAPAD
// ============================================================================
const clienteSupabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

// Helpers de Pin Local para Convidados (não afeta o pin do Dono da Mesa no banco!)
function obterPinsLocaisConvidado(userId) {
    if (!userId) return {};
    try {
        return JSON.parse(localStorage.getItem(`obiwan_guest_pins_${userId}`) || "{}");
    } catch {
        return {};
    }
}

function salvarPinLocalConvidado(userId, campaignId, fixado) {
    if (!userId || !campaignId) return;
    const map = obterPinsLocaisConvidado(userId);
    if (fixado) map[campaignId] = true;
    else delete map[campaignId];
    localStorage.setItem(`obiwan_guest_pins_${userId}`, JSON.stringify(map));
}

// Mapeia uma linha da tabela nova 'campaigns' para o formato compatível com o frontend
function mapearCampanha(row, currentUserId = null) {
    if (!row) return null;
    const isOwner = Boolean(currentUserId && row.owner_id === currentUserId);
    const prefs = row.automation_prefs || {
        enabled: true,
        combat_damage: "ask_on_combat_start",
        combat_strain: "ask_on_combat_start",
        items: "confirm_card",
        credits: "confirm_card",
        xp: "manual",
        sheet_management: "confirm_card",
        guest_can_manage: false
    };
    const guestPins = !isOwner && currentUserId ? obterPinsLocaisConvidado(currentUserId) : {};
    // Para quem entra por código (convidado), a conversa NUNCA chega fixada do dono; usa apenas o pin local do convidado!
    const isPinned = isOwner ? Boolean(row.pinned) : Boolean(guestPins[row.id]);

    return {
        id: row.id,
        titulo: row.title || "Nova Aventura...",
        title: row.title || "Nova Aventura...",
        fixado: isPinned,
        pinned: isPinned,
        usuario_id: row.owner_id,
        owner_id: row.owner_id,
        isOwner,
        canManageTable: isOwner || Boolean(prefs.guest_can_manage),
        join_code: row.join_code || "------",
        status: row.status || "ativo",
        canon_summary: row.canon_summary || "",
        scene_state: row.scene_state || { in_combat: false, combat_auto_damage: null },
        automation_prefs: prefs,
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}

// Chama o backend serverless /api/kenobi com retry automático em pico 503 do Gemini
async function chamarBackendKenobi(payload) {
    const { data: sessionData } = await clienteSupabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
    }

    const endpoints = CONFIG.KENOBI_API_ENDPOINTS || ["https://swdatapad.vercel.app/api/kenobi"];
    let ultimoErro = "Não foi possível conectar ao servidor do Mestre Kenobi.";

    for (const url of endpoints) {
        const maxAttempts = url.includes("localhost") ? 1 : 2;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const resp = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                const json = await resp.json().catch(() => null);
                if (!resp.ok || !json?.ok) {
                    const serverErr = json?.error || `Erro HTTP ${resp.status}`;
                    ultimoErro = serverErr;

                    // Pico temporário de demanda (503) ou rate-limit (429): tenta mais 1x após breve pausa
                    if ((resp.status === 503 || resp.status === 429) && attempt < maxAttempts) {
                        await new Promise((r) => setTimeout(r, 1600));
                        continue;
                    }

                    // Erro de autenticação, validação ou resposta explícita do servidor de produção
                    if (resp.status === 401 || resp.status === 400 || resp.status === 503 || resp.status === 429) {
                        throw new Error(serverErr);
                    }
                    break;
                }
                return json;
            } catch (err) {
                ultimoErro = err?.message || ultimoErro;
                // Se já é um erro definitivo vindo do backend de produção, não mascara tentando outro endpoint
                if (url.includes("swdatapad.vercel.app") && attempt >= maxAttempts) {
                    throw new Error(ultimoErro);
                }
                if (attempt < maxAttempts) {
                    await new Promise((r) => setTimeout(r, 1200));
                    continue;
                }
                break;
            }
        }
    }

    throw new Error(ultimoErro);
}

const API = {
    clienteSupabase,

    // 1. Cadastrar Novo Usuário
    async cadastrar(nome, email, senha, tratamento) {
        try {
            const { data, error } = await clienteSupabase.auth.signUp({
                email: email,
                password: senha,
                options: {
                    data: {
                        nome_operativo: nome,
                        tratamento: tratamento
                    }
                }
            });

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (erro) {
            console.error("Erro no cadastro:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // 2. Fazer Login
    async login(email, senha) {
        try {
            const { data, error } = await clienteSupabase.auth.signInWithPassword({
                email: email,
                password: senha
            });

            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (erro) {
            console.error("Erro no login:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // 3. Fazer Logout
    async logout() {
        try {
            const { error } = await clienteSupabase.auth.signOut();
            if (error) throw error;
            return { sucesso: true };
        } catch (erro) {
            console.error("Erro no logout:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // 3B. Atualizar Perfil do Operativo no Supabase Auth (nome_operativo + tratamento + trava de 7 dias para troca de nome)
    async atualizarPerfilUsuario(nomeOperativo, tratamento, opcoes = {}) {
        try {
            const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
            const { data: userData } = await clienteSupabase.auth.getUser();
            const user = userData?.user;
            const meta = user?.user_metadata || {};

            const nomeAnterior = (meta.nome_operativo || "").trim();
            const novoNomeLimpo = (nomeOperativo || "").trim();
            const lastUpdated = Number(meta.nome_updated_at || localStorage.getItem("obiwan_nome_updated_at") || 0);
            const mudandoNome =
                nomeAnterior &&
                novoNomeLimpo.toLowerCase() !== nomeAnterior.toLowerCase() &&
                !opcoes.isInitialSetup;

            if (mudandoNome && lastUpdated > 0) {
                const elapsed = Date.now() - lastUpdated;
                if (elapsed < SEVEN_DAYS_MS) {
                    const restanteMs = SEVEN_DAYS_MS - elapsed;
                    const diasRestantes = Math.max(1, Math.ceil(restanteMs / (24 * 60 * 60 * 1000)));
                    return {
                        sucesso: false,
                        cooldown: true,
                        diasRestantes,
                        erro: `Você alterou seu Nome de Operativo recentemente. Próxima troca disponível em ${diasRestantes} dia(s).`
                    };
                }
            }

            const nextUpdatedAt =
                mudandoNome || (!lastUpdated && !opcoes.isInitialSetup) ? Date.now() : lastUpdated || Date.now();

            const { data, error } = await clienteSupabase.auth.updateUser({
                data: {
                    nome_operativo: novoNomeLimpo,
                    tratamento: tratamento,
                    nome_updated_at: nextUpdatedAt
                }
            });
            if (error) throw error;
            localStorage.setItem("obiwan_user", novoNomeLimpo);
            localStorage.setItem("obiwan_tratamento", tratamento);
            localStorage.setItem("obiwan_nome_updated_at", String(nextUpdatedAt));
            return { sucesso: true, dados: data, nome_updated_at: nextUpdatedAt };
        } catch (erro) {
            console.error("Erro ao atualizar perfil:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // 3C. Entrar em uma Mesa Compartilhada usando Código de 6 caracteres (#7FFEDA) + Vincular Ficha
    async entrarCampanhaPorCodigo(joinCode, characterIdOpcional = null) {
        try {
            const cleanCode = String(joinCode || "").replace(/^#/, "").trim().toUpperCase();
            if (!cleanCode || cleanCode.length < 4) {
                throw new Error("Informe o código de 6 caracteres da mesa (ex: 7FFEDA).");
            }

            const { data: userData } = await clienteSupabase.auth.getUser();
            const userId = userData?.user?.id;
            if (!userId) throw new Error("Sessão expirada. Faça login novamente.");

            let targetCharId = characterIdOpcional;
            let targetRole = "party";

            const { data: ownChars } = await clienteSupabase
                .from("characters")
                .select("id, data")
                .eq("user_id", userId);

            if (!targetCharId && Array.isArray(ownChars) && ownChars.length > 0) {
                const firstPc = ownChars.find((c) => !c.data?.entityType || c.data?.entityType === "pc") || ownChars[0];
                targetCharId = firstPc?.id || null;
                targetRole = firstPc?.data?.entityType === "ship" ? "ship" : firstPc?.data?.entityType === "npc" ? "npc_active" : "party";
            } else if (targetCharId && Array.isArray(ownChars)) {
                const found = ownChars.find((c) => c.id === targetCharId);
                if (found) {
                    targetRole = found.data?.entityType === "ship" ? "ship" : found.data?.entityType === "npc" ? "npc_active" : "party";
                }
            }

            if (!targetCharId) {
                throw new Error("Crie ou selecione pelo menos uma ficha no Datapad (ou peça ao Mestre Kenobi para criar sua ficha) antes de vincular à mesa.");
            }

            const { data: rpcRes, error: rpcErr } = await clienteSupabase.rpc("join_campaign_by_code", {
                p_join_code: cleanCode,
                p_character_id: targetCharId,
                p_role: targetRole
            });

            if (rpcErr) throw rpcErr;

            return {
                sucesso: true,
                dados: {
                    campaignId: rpcRes?.campaign_id,
                    title: rpcRes?.title,
                    joinCode: rpcRes?.join_code,
                    characterId: rpcRes?.character_id
                }
            };
        } catch (erro) {
            console.error("Erro ao entrar na mesa por código:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // ==========================================
    // CAMPANHAS / CONVERSAS (Tabela public.campaigns)
    // ==========================================

    // 4. Criar Nova Campanha (e auto-vincular fichas principais do usuário se existirem)
    async criarConversa(titulo) {
        try {
            const { data: userData, error: userError } = await clienteSupabase.auth.getUser();
            if (userError || !userData?.user) throw userError || new Error("Não autenticado");

            const campaignId =
                typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
                    ? crypto.randomUUID()
                    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
                          const r = (Math.random() * 16) | 0;
                          const v = c === "x" ? r : (r & 0x3) | 0x8;
                          return v.toString(16);
                      });

            // Passo 1: INSERT sem RETURNING (evita que a função STABLE de RLS rode antes do commit da linha)
            const { error: insertError } = await clienteSupabase
                .from("campaigns")
                .insert([
                    {
                        id: campaignId,
                        title: titulo || "Nova Aventura...",
                        owner_id: userData.user.id
                    }
                ]);

            if (insertError) throw insertError;

            // Passo 2: SELECT em statement separado (linha já comitada no snapshot)
            const { data, error } = await clienteSupabase
                .from("campaigns")
                .select("*")
                .eq("id", campaignId)
                .single();

            if (error) throw error;

            // Auto-vincula o primeiro Operativo (PC) da conta do usuário à nova aventura para conveniência
            try {
                const { data: chars } = await clienteSupabase
                    .from("characters")
                    .select("id, data")
                    .eq("user_id", userData.user.id);

                if (Array.isArray(chars) && chars.length > 0) {
                    const firstPc = chars.find((c) => !c.data?.entityType || c.data?.entityType === "pc") || chars[0];
                    if (firstPc) {
                        await clienteSupabase.from("campaign_characters").insert({
                            campaign_id: data.id,
                            character_id: firstPc.id,
                            added_by_user_id: userData.user.id,
                            role: firstPc.data?.entityType === "ship" ? "ship" : firstPc.data?.entityType === "npc" ? "npc_active" : "party",
                            active_in_scene: true
                        });
                    }
                }
            } catch (e) {
                console.warn("Aviso ao auto-vincular ficha inicial:", e);
            }

            return { sucesso: true, dados: mapearCampanha(data, userData.user.id) };
        } catch (erro) {
            console.error("Erro ao criar campanha:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // 5. Puxar Lista de Campanhas do Usuário (Próprias ou Convidado)
    async obterConversas() {
        try {
            const { data: userData } = await clienteSupabase.auth.getUser();
            const currentUserId = userData?.user?.id || null;

            const { data, error } = await clienteSupabase
                .from("campaigns")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            const lista = (data || [])
                .map((row) => mapearCampanha(row, currentUserId))
                .sort((a, b) => Number(b.fixado) - Number(a.fixado));
            return { sucesso: true, dados: lista };
        } catch (erro) {
            console.error("Erro ao buscar campanhas:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // 5B. Obter Detalhes de uma Campanha Específica
    async obterCampanhaPorId(id) {
        try {
            const { data: userData } = await clienteSupabase.auth.getUser();
            const currentUserId = userData?.user?.id || null;

            const { data, error } = await clienteSupabase
                .from("campaigns")
                .select("*")
                .eq("id", id)
                .single();
            if (error) throw error;
            return { sucesso: true, dados: mapearCampanha(data, currentUserId) };
        } catch (erro) {
            return { sucesso: false, erro: erro.message };
        }
    },

    // 6. Atualizar Campanha (Com trava de segurança: Convidado não renomeia nem gerencia sem permissão do Dono!)
    async atualizarConversa(id, atualizacoes) {
        try {
            const { data: userData } = await clienteSupabase.auth.getUser();
            const currentUserId = userData?.user?.id;
            if (!currentUserId) throw new Error("Sessão expirada.");

            const { data: campAtual, error: campErr } = await clienteSupabase
                .from("campaigns")
                .select("*")
                .eq("id", id)
                .single();
            if (campErr || !campAtual) throw campErr || new Error("Mesa não encontrada.");

            const isOwner = campAtual.owner_id === currentUserId;
            const guestCanManage = Boolean(campAtual.automation_prefs?.guest_can_manage);

            // Se for convidado tentando fixar/desfixar: salva APENAS localmente para ele!
            if (!isOwner && ("fixado" in atualizacoes || "pinned" in atualizacoes)) {
                const novoPin = Boolean(atualizacoes.fixado ?? atualizacoes.pinned);
                salvarPinLocalConvidado(currentUserId, id, novoPin);
                return { sucesso: true, dados: mapearCampanha(campAtual, currentUserId) };
            }

            // Convidado NUNCA pode renomear a mesa do dono
            if (!isOwner && ("titulo" in atualizacoes || "title" in atualizacoes)) {
                throw new Error("Apenas o criador da mesa pode renomear esta aventura.");
            }

            // Convidado só pode editar Diário Canônico ou Automação se o dono liberou guest_can_manage
            if (!isOwner && !guestCanManage && ("canon_summary" in atualizacoes || "automation_prefs" in atualizacoes)) {
                throw new Error("Apenas o dono da mesa pode alterar o Diário Canônico e a Automação (permissão restrita).");
            }

            const payload = {};
            if (isOwner && "titulo" in atualizacoes) payload.title = atualizacoes.titulo;
            if (isOwner && "title" in atualizacoes) payload.title = atualizacoes.title;
            if (isOwner && "fixado" in atualizacoes) payload.pinned = atualizacoes.fixado;
            if (isOwner && "pinned" in atualizacoes) payload.pinned = atualizacoes.pinned;
            if ("canon_summary" in atualizacoes) payload.canon_summary = atualizacoes.canon_summary;
            if ("automation_prefs" in atualizacoes) {
                // Garante que apenas o dono possa alterar a chave guest_can_manage
                payload.automation_prefs = {
                    ...atualizacoes.automation_prefs,
                    guest_can_manage: isOwner
                        ? Boolean(atualizacoes.automation_prefs?.guest_can_manage)
                        : Boolean(campAtual.automation_prefs?.guest_can_manage)
                };
            }
            if ("scene_state" in atualizacoes) payload.scene_state = atualizacoes.scene_state;
            payload.updated_at = new Date().toISOString();

            const { data, error } = await clienteSupabase
                .from("campaigns")
                .update(payload)
                .eq("id", id)
                .select("*")
                .single();

            if (error) throw error;
            return { sucesso: true, dados: mapearCampanha(data, currentUserId) };
        } catch (erro) {
            console.error("Erro ao atualizar campanha:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // 7. Excluir Campanha (Apenas o Dono da Mesa pode excluir!)
    async excluirConversa(id) {
        try {
            const { data: userData } = await clienteSupabase.auth.getUser();
            const currentUserId = userData?.user?.id;
            const { data: campAtual } = await clienteSupabase
                .from("campaigns")
                .select("owner_id")
                .eq("id", id)
                .single();

            if (!campAtual || campAtual.owner_id !== currentUserId) {
                throw new Error("Apenas o dono da mesa pode excluir esta aventura.");
            }

            const { error } = await clienteSupabase
                .from("campaigns")
                .delete()
                .eq("id", id)
                .eq("owner_id", currentUserId);

            if (error) throw error;
            return { sucesso: true };
        } catch (erro) {
            console.error("Erro ao excluir campanha:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // 7B. Sair da Mesa (Para convidados que entraram por código — remove apenas o vínculo deles sem apagar a mesa do dono)
    async sairDaMesaConvidado(conversaId) {
        try {
            const { data: userData } = await clienteSupabase.auth.getUser();
            const currentUserId = userData?.user?.id;
            if (!currentUserId) throw new Error("Sessão expirada.");

            // Remove todas as fichas pertencentes ao convidado desta campanha
            const { data: ownChars } = await clienteSupabase
                .from("characters")
                .select("id")
                .eq("user_id", currentUserId);
            const ownCharIds = (ownChars || []).map((c) => c.id);

            await clienteSupabase
                .from("campaign_characters")
                .delete()
                .eq("campaign_id", conversaId)
                .eq("added_by_user_id", currentUserId);

            if (ownCharIds.length > 0) {
                await clienteSupabase
                    .from("campaign_characters")
                    .delete()
                    .eq("campaign_id", conversaId)
                    .in("character_id", ownCharIds);
            }

            const { error } = await clienteSupabase
                .from("campaign_members")
                .delete()
                .eq("campaign_id", conversaId)
                .eq("user_id", currentUserId);

            if (error) throw error;
            salvarPinLocalConvidado(currentUserId, conversaId, false);
            return { sucesso: true };
        } catch (erro) {
            console.error("Erro ao sair da mesa:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // ==========================================
    // MENSAGENS & ACTION CARDS (public.messages + public.pending_actions)
    // ==========================================

    // 8. Puxar Mensagens + Action Cards da Campanha
    async obterMensagens(conversaId) {
        try {
            const [{ data: msgs, error: msgErr }, { data: actions }] = await Promise.all([
                clienteSupabase
                    .from("messages")
                    .select("*")
                    .eq("campaign_id", conversaId)
                    .order("created_at", { ascending: true }),
                clienteSupabase
                    .from("pending_actions")
                    .select("*")
                    .eq("campaign_id", conversaId)
                    .order("created_at", { ascending: true })
            ]);

            if (msgErr) throw msgErr;

            const actionsByMsgId = new Map();
            (actions || []).forEach((act) => {
                if (!act.message_id) return;
                if (!actionsByMsgId.has(act.message_id)) {
                    actionsByMsgId.set(act.message_id, []);
                }
                actionsByMsgId.get(act.message_id).push(act);
            });

            const enriched = (msgs || []).map((m) => ({
                ...m,
                conversa_id: m.campaign_id,
                actionCards: actionsByMsgId.get(m.id) || m.metadata?.actionCards || [],
                autoAppliedLogs: m.metadata?.autoAppliedLogs || []
            }));

            return { sucesso: true, dados: enriched };
        } catch (erro) {
            console.error("Erro ao buscar mensagens:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // 9. Máquina do Tempo (Poda da Linha do Tempo + Memórias Futuras em Cascata)
    async voltarNoTempo(mensagemId) {
        try {
            const { data: msgAlvo, error: erroBusca } = await clienteSupabase
                .from("messages")
                .select("created_at, campaign_id")
                .eq("id", mensagemId)
                .single();

            if (erroBusca) throw erroBusca;

            const { error: rpcError } = await clienteSupabase.rpc("prune_campaign_timeline", {
                p_campaign_id: msgAlvo.campaign_id,
                p_from_message_id: mensagemId
            });

            if (rpcError) throw rpcError;
            return { sucesso: true };
        } catch (erro) {
            console.error("Erro ao voltar no tempo:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // ==========================================
    // FICHAS VINCULADAS DO DATAPAD (Solo & Dupla c/ Nayla)
    // ==========================================

    async obterFichasDaCampanha(conversaId) {
        try {
            const { data: userData } = await clienteSupabase.auth.getUser();
            const currentUserId = userData?.user?.id;

            const [{ data: linked, error: linkErr }, { data: ownChars }] = await Promise.all([
                clienteSupabase
                    .from("campaign_characters")
                    .select("id, campaign_id, character_id, added_by_user_id, role, active_in_scene, characters(id, user_id, data)")
                    .eq("campaign_id", conversaId),
                currentUserId
                    ? clienteSupabase.from("characters").select("id, user_id, data").eq("user_id", currentUserId)
                    : Promise.resolve({ data: [] })
            ]);

            if (linkErr) throw linkErr;

            const fichasVinculadas = (linked || [])
                .filter((row) => row.characters?.data)
                .map((row) => ({
                    linkId: row.id,
                    characterId: row.character_id,
                    ownerUserId: row.characters.user_id,
                    isOwnCharacter: row.characters.user_id === currentUserId,
                    role: row.role,
                    activeInScene: row.active_in_scene,
                    entity: row.characters.data
                }));

            const minhasFichas = (ownChars || [])
                .filter((row) => row.data)
                .map((row) => ({
                    characterId: row.id,
                    entity: row.data
                }));

            return {
                sucesso: true,
                vinculadas: fichasVinculadas,
                minhasFichas: minhasFichas
            };
        } catch (erro) {
            console.error("Erro ao obter fichas da campanha:", erro.message);
            return { sucesso: false, erro: erro.message, vinculadas: [], minhasFichas: [] };
        }
    },

    async alternarVinculoMinhaFicha(conversaId, characterId, entityType, vincular) {
        try {
            const { data: userData } = await clienteSupabase.auth.getUser();
            const userId = userData?.user?.id;
            if (!userId) throw new Error("Usuário não autenticado.");

            if (vincular) {
                const role = entityType === "ship" ? "ship" : entityType === "npc" ? "npc_active" : "party";
                const { error } = await clienteSupabase
                    .from("campaign_characters")
                    .upsert(
                        {
                            campaign_id: conversaId,
                            character_id: characterId,
                            added_by_user_id: userId,
                            role: role,
                            active_in_scene: true
                        },
                        { onConflict: "campaign_id,character_id" }
                    );
                if (error) throw error;
            } else {
                const { error } = await clienteSupabase
                    .from("campaign_characters")
                    .delete()
                    .eq("campaign_id", conversaId)
                    .eq("character_id", characterId);
                if (error) throw error;
            }
            return { sucesso: true };
        } catch (erro) {
            return { sucesso: false, erro: erro.message };
        }
    },

    // ==========================================
    // CÉREBRO DO MESTRE KENOBI (/api/kenobi)
    // ==========================================

    async enviarMensagemParaKenobi(conversaId, mensagem) {
        const userName = localStorage.getItem("obiwan_user") || "Operativo";
        const treatment = localStorage.getItem("obiwan_tratamento") || "M";
        return await chamarBackendKenobi({
            action: "chat",
            campaignId: conversaId,
            message: mensagem,
            userName,
            treatment
        });
    },

    async resolverActionCard(pendingActionId, decision) {
        return await chamarBackendKenobi({
            action: "resolve_action",
            pendingActionId,
            decision
        });
    },

    async rolarTesteDePericia(pendingActionId, pool) {
        return await chamarBackendKenobi({
            action: "roll_check",
            pendingActionId,
            pool
        });
    },

    // ==========================================
    // CÉREBRO CANÔNICO (Entidades, Fatos Ativos & Capítulos)
    // ==========================================
    async obterMemoriaCanonica(conversaId) {
        try {
            const [entRes, factRes, chapRes] = await Promise.all([
                clienteSupabase
                    .from("campaign_entities")
                    .select("*")
                    .eq("campaign_id", conversaId)
                    .order("updated_at", { ascending: false }),
                clienteSupabase
                    .from("campaign_facts")
                    .select("*")
                    .eq("campaign_id", conversaId)
                    .eq("status", "active")
                    .order("is_pinned", { ascending: false })
                    .order("updated_at", { ascending: false }),
                clienteSupabase
                    .from("campaign_chapters")
                    .select("*")
                    .eq("campaign_id", conversaId)
                    .order("chapter_number", { ascending: true })
            ]);
            return {
                sucesso: true,
                entities: entRes.data || [],
                facts: factRes.data || [],
                chapters: chapRes.data || []
            };
        } catch (erro) {
            return { sucesso: false, erro: erro.message, entities: [], facts: [], chapters: [] };
        }
    },

    async adicionarFatoCanonico(conversaId, { content, category = "correction", factKey = "" }) {
        try {
            const texto = String(content || "").trim();
            if (!texto) throw new Error("Escreva o fato canônico antes de salvar.");
            const key =
                String(factKey || "")
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9_]+/g, "_") ||
                `fato_${Date.now()}`;
            const { data, error } = await clienteSupabase
                .from("campaign_facts")
                .insert({
                    campaign_id: conversaId,
                    category,
                    fact_key: key,
                    content: texto,
                    status: "active",
                    authority: "user_pinned",
                    is_pinned: true
                })
                .select("*")
                .single();
            if (error) throw error;
            return { sucesso: true, dados: data };
        } catch (erro) {
            return { sucesso: false, erro: erro.message };
        }
    },

    async arquivarFatoCanonico(factId) {
        try {
            const { error } = await clienteSupabase
                .from("campaign_facts")
                .update({ status: "archived", updated_at: new Date().toISOString() })
                .eq("id", factId);
            if (error) throw error;
            return { sucesso: true };
        } catch (erro) {
            return { sucesso: false, erro: erro.message };
        }
    },

    async alternarFixacaoFatoCanonico(factId, isPinned) {
        try {
            const { error } = await clienteSupabase
                .from("campaign_facts")
                .update({
                    is_pinned: Boolean(isPinned),
                    authority: isPinned ? "user_pinned" : "ai_extracted",
                    updated_at: new Date().toISOString()
                })
                .eq("id", factId);
            if (error) throw error;
            return { sucesso: true };
        } catch (erro) {
            return { sucesso: false, erro: erro.message };
        }
    }
};
