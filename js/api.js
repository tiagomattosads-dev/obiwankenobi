// ============================================================================
// API UNIFICADA NOCTURNE DYNAMICS — MESTRE KENOBI <-> SUPABASE DATAPAD
// ============================================================================
const clienteSupabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

// Mapeia uma linha da tabela nova 'campaigns' para o formato compatível com o frontend
function mapearCampanha(row) {
    if (!row) return null;
    return {
        id: row.id,
        titulo: row.title || "Nova Aventura...",
        title: row.title || "Nova Aventura...",
        fixado: Boolean(row.pinned),
        pinned: Boolean(row.pinned),
        usuario_id: row.owner_id,
        owner_id: row.owner_id,
        join_code: row.join_code || "------",
        status: row.status || "ativo",
        canon_summary: row.canon_summary || "",
        scene_state: row.scene_state || { in_combat: false, combat_auto_damage: null },
        automation_prefs: row.automation_prefs || {
            enabled: true,
            combat_damage: "ask_on_combat_start",
            combat_strain: "ask_on_combat_start",
            items: "confirm_card",
            credits: "confirm_card",
            xp: "manual"
        },
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}

// Chama o backend serverless /api/kenobi com fallback automático (localhost -> vercel)
async function chamarBackendKenobi(payload) {
    const { data: sessionData } = await clienteSupabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
    }

    const endpoints = CONFIG.KENOBI_API_ENDPOINTS || ["https://swdatapad.vercel.app/api/kenobi"];
    let ultimoErro = "Não foi possível conectar ao servidor do Mestre Kenobi.";

    for (const url of endpoints) {
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
                ultimoErro = json?.error || `Erro HTTP ${resp.status}`;
                if (resp.status === 401 || resp.status === 400 || resp.status === 404) {
                    throw new Error(ultimoErro);
                }
                continue;
            }
            return json;
        } catch (err) {
            ultimoErro = err?.message || ultimoErro;
            continue;
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

    // 3B. Atualizar Perfil do Operativo no Supabase Auth (nome_operativo + tratamento)
    async atualizarPerfilUsuario(nomeOperativo, tratamento) {
        try {
            const { data, error } = await clienteSupabase.auth.updateUser({
                data: {
                    nome_operativo: nomeOperativo,
                    tratamento: tratamento
                }
            });
            if (error) throw error;
            localStorage.setItem("obiwan_user", nomeOperativo);
            localStorage.setItem("obiwan_tratamento", tratamento);
            return { sucesso: true, dados: data };
        } catch (erro) {
            console.error("Erro ao atualizar perfil:", erro.message);
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

            return { sucesso: true, dados: mapearCampanha(data) };
        } catch (erro) {
            console.error("Erro ao criar campanha:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // 5. Puxar Lista de Campanhas do Usuário (Próprias ou Convidado)
    async obterConversas() {
        try {
            const { data, error } = await clienteSupabase
                .from("campaigns")
                .select("*")
                .order("pinned", { ascending: false })
                .order("created_at", { ascending: false });

            if (error) throw error;
            return { sucesso: true, dados: (data || []).map(mapearCampanha) };
        } catch (erro) {
            console.error("Erro ao buscar campanhas:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // 5B. Obter Detalhes de uma Campanha Específica
    async obterCampanhaPorId(id) {
        try {
            const { data, error } = await clienteSupabase
                .from("campaigns")
                .select("*")
                .eq("id", id)
                .single();
            if (error) throw error;
            return { sucesso: true, dados: mapearCampanha(data) };
        } catch (erro) {
            return { sucesso: false, erro: erro.message };
        }
    },

    // 6. Atualizar Campanha (Renomear, Fixar, Diário Canônico, Preferências de Automação)
    async atualizarConversa(id, atualizacoes) {
        try {
            const payload = {};
            if ("titulo" in atualizacoes) payload.title = atualizacoes.titulo;
            if ("title" in atualizacoes) payload.title = atualizacoes.title;
            if ("fixado" in atualizacoes) payload.pinned = atualizacoes.fixado;
            if ("pinned" in atualizacoes) payload.pinned = atualizacoes.pinned;
            if ("canon_summary" in atualizacoes) payload.canon_summary = atualizacoes.canon_summary;
            if ("automation_prefs" in atualizacoes) payload.automation_prefs = atualizacoes.automation_prefs;
            if ("scene_state" in atualizacoes) payload.scene_state = atualizacoes.scene_state;
            payload.updated_at = new Date().toISOString();

            const { data, error } = await clienteSupabase
                .from("campaigns")
                .update(payload)
                .eq("id", id)
                .select("*")
                .single();

            if (error) throw error;
            return { sucesso: true, dados: mapearCampanha(data) };
        } catch (erro) {
            console.error("Erro ao atualizar campanha:", erro.message);
            return { sucesso: false, erro: erro.message };
        }
    },

    // 7. Excluir Campanha
    async excluirConversa(id) {
        try {
            const { error } = await clienteSupabase
                .from("campaigns")
                .delete()
                .eq("id", id);

            if (error) throw error;
            return { sucesso: true };
        } catch (erro) {
            console.error("Erro ao excluir campanha:", erro.message);
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
    }
};
