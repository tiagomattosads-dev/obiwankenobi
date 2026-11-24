document.addEventListener('DOMContentLoaded', () => {
    // === ELEMENTOS DO CHAT EXPANSÍVEL ===
    const chatInput = document.getElementById('chatInput');
    const expandBtn = document.getElementById('expandBtn');
    const expandIcon = document.getElementById('expandIcon');
    const inputContainer = document.getElementById('inputContainer');
    const inputSection = document.querySelector('.inputSection');
    const chatOverlay = document.getElementById('chatOverlay');

    // === ELEMENTOS DO MENU DE CONFIGURAÇÕES ===
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsDrawer = document.getElementById('settingsDrawer');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const settingsOverlay = document.getElementById('settingsOverlay');

    // === ELEMENTOS DE ENVIO E MENSAGENS ===
    const sendBtn = document.getElementById('sendBtn');
    const messagesArea = document.getElementById('messagesArea');
    const glowEffects = document.querySelectorAll('.glowEffect');

    // === ELEMENTOS DA BARRA TÁTICA & MODAIS DO ECOSSISTEMA ===
    const campaignCodePill = document.getElementById('campaignCodePill');
    const campaignJoinCodeText = document.getElementById('campaignJoinCodeText');
    const scenePartyPills = document.getElementById('scenePartyPills');
    const manageSheetsBtn = document.getElementById('manageSheetsBtn');
    const openCanonBtn = document.getElementById('openCanonBtn');
    const openAutomationBtn = document.getElementById('openAutomationBtn');

    const sheetsModal = document.getElementById('sheetsModal');
    const modalJoinCodeDisplay = document.getElementById('modalJoinCodeDisplay');
    const sheetsModalList = document.getElementById('sheetsModalList');

    const canonModal = document.getElementById('canonModal');
    const canonSummaryTextarea = document.getElementById('canonSummaryTextarea');
    const saveCanonBtn = document.getElementById('saveCanonBtn');

    const automationModal = document.getElementById('automationModal');
    const prefEnabled = document.getElementById('prefEnabled');
    const prefCombat = document.getElementById('prefCombat');
    const prefItems = document.getElementById('prefItems');
    const prefCredits = document.getElementById('prefCredits');
    const prefXp = document.getElementById('prefXp');
    const saveAutomationBtn = document.getElementById('saveAutomationBtn');

    let conversaAtualId = null;
    let campanhaAtualObj = null;

    // Garante que existe uma sessão válida no Supabase unificado do Datapad
    API.clienteSupabase.auth.getSession().then(({ data }) => {
        if (!data?.session?.user) {
            localStorage.removeItem('obiwan_user');
            window.location.href = 'index.html';
        }
    });

    // ==========================================
    // 1. LÓGICA DO AUTO-RESIZE E EXPANSÃO DO CHAT
    // ==========================================
    const handleInputResize = () => {
        if (!chatInput) return;
        chatInput.style.height = 'auto';
        const scrollHeight = chatInput.scrollHeight;
        const limitHeight = 120;

        if (!inputSection.classList.contains('expandedMode')) {
            if (scrollHeight > limitHeight) {
                chatInput.style.height = limitHeight + 'px';
                chatInput.style.overflowY = 'auto';
                expandBtn.classList.remove('hidden');
            } else {
                chatInput.style.height = scrollHeight + 'px';
                chatInput.style.overflowY = 'hidden';
                expandBtn.classList.add('hidden');
            }
        } else {
            chatInput.style.height = '100%';
        }
    };

    if (chatInput && expandBtn && inputContainer && inputSection) {
        chatInput.addEventListener('input', handleInputResize);

        const toggleExpandedMode = () => {
            inputSection.classList.toggle('expandedMode');
            chatOverlay.classList.toggle('showOverlay');

            if (inputSection.classList.contains('expandedMode')) {
                expandIcon.innerHTML = `
                    <polyline points="4 14 10 14 10 20"></polyline>
                    <polyline points="20 10 14 10 14 4"></polyline>
                    <line x1="14" y1="10" x2="21" y2="3"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                `;
                chatInput.style.height = '';
                chatInput.style.overflowY = '';
                chatInput.focus();
            } else {
                expandIcon.innerHTML = `
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                `;
                handleInputResize();
            }
        };

        expandBtn.addEventListener('click', toggleExpandedMode);
        chatOverlay.addEventListener('click', () => {
            if (inputSection.classList.contains('expandedMode')) toggleExpandedMode();
        });
    }

    // ==========================================
    // 2. PAINEL LATERAL DE CONFIGURAÇÕES & SIDEBAR
    // ==========================================
    if (settingsBtn && settingsDrawer && closeSettingsBtn && settingsOverlay) {
        const toggleSettingsDrawer = () => {
            settingsDrawer.classList.toggle('open');
            settingsOverlay.classList.toggle('active');
        };
        settingsBtn.addEventListener('click', toggleSettingsDrawer);
        closeSettingsBtn.addEventListener('click', toggleSettingsDrawer);
        settingsOverlay.addEventListener('click', toggleSettingsDrawer);
    }

    const menuToggle = document.getElementById('menuToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    const mobileOverlay = document.getElementById('settingsOverlay');

    if (sidebar) {
        const toggleSidebar = () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('open');
                mobileOverlay.classList.toggle('active');
            } else {
                sidebar.classList.toggle('collapsed');
            }
        };

        if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
        if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleSidebar);

        mobileOverlay.addEventListener('click', () => {
            if (sidebar.classList.contains('open') && window.innerWidth <= 768) {
                toggleSidebar();
            }
        });
    }

    // ==========================================
    // 2B. BARRA TÁTICA DA CAMPANHA & FICHAS EM TEMPO REAL
    // ==========================================
    const atualizarBarraTatica = async () => {
        if (!conversaAtualId) {
            if (campaignJoinCodeText) campaignJoinCodeText.textContent = '#------';
            if (scenePartyPills) {
                scenePartyPills.innerHTML = '<span class="emptyPartyHint">Inicie ou selecione uma aventura ao lado.</span>';
            }
            return;
        }

        const [campRes, fichasRes] = await Promise.all([
            API.obterCampanhaPorId(conversaAtualId),
            API.obterFichasDaCampanha(conversaAtualId)
        ]);

        if (campRes.sucesso && campRes.dados) {
            campanhaAtualObj = campRes.dados;
            const codeText = `#${campRes.dados.join_code}`;
            if (campaignJoinCodeText) campaignJoinCodeText.textContent = codeText;
            if (modalJoinCodeDisplay) modalJoinCodeDisplay.textContent = codeText;
        }

        if (!scenePartyPills) return;

        const ativas = (fichasRes.vinculadas || []).filter((f) => f.activeInScene);
        if (ativas.length === 0) {
            scenePartyPills.innerHTML =
                '<span class="emptyPartyHint">Nenhuma ficha vinculada ainda — clique em "👥 Fichas" para adicionar.</span>';
            return;
        }

        scenePartyPills.innerHTML = '';
        ativas.forEach((item) => {
            const ent = item.entity;
            const pill = document.createElement('div');
            const isShip = ent.entityType === 'ship';
            const isPartner = !item.isOwnCharacter;
            pill.className = `partySheetPill ${isShip ? 'shipPill' : isPartner ? 'partnerPill' : ''}`;

            let statsText = '';
            if (isShip) {
                statsText = `AC ${ent.hullTrauma?.current ?? 0}/${ent.hullTrauma?.threshold ?? 15} • FS ${ent.systemStrain?.current ?? 0}/${ent.systemStrain?.threshold ?? 15}`;
            } else {
                statsText = `❤️ ${ent.wounds?.current ?? 0}/${ent.wounds?.threshold ?? 10} • ⚡ ${ent.strain?.current ?? 0}/${ent.strain?.threshold ?? 10}${typeof ent.credits === 'number' ? ` • 💰 ${ent.credits} CR` : ''}`;
            }

            const icon = isShip ? '🚀' : ent.entityType === 'npc' ? '🎭' : isPartner ? '✨' : '⚔️';
            pill.innerHTML = `
                <strong>${icon} ${ent.name}</strong>
                <span class="partySheetStats">${statsText}</span>
            `;
            scenePartyPills.appendChild(pill);
        });
    };

    if (campaignCodePill) {
        campaignCodePill.addEventListener('click', async () => {
            if (!campanhaAtualObj?.join_code) return;
            try {
                await navigator.clipboard.writeText(campanhaAtualObj.join_code);
                const old = campaignJoinCodeText.textContent;
                campaignJoinCodeText.textContent = 'COPIADO!';
                setTimeout(() => {
                    campaignJoinCodeText.textContent = old;
                }, 1500);
            } catch (e) {
                console.warn(e);
            }
        });
    }

    // Escuta em Tempo Real no Supabase quando alguma ficha mudar no Datapad!
    API.clienteSupabase
        .channel('kenobi-live-sheets')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'characters' }, () => {
            if (conversaAtualId) atualizarBarraTatica();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'campaign_characters' }, () => {
            if (conversaAtualId) atualizarBarraTatica();
        })
        .subscribe();

    // ==========================================
    // 3. RENDERIZAÇÃO DE ACTION CARDS INTERATIVOS DO MESTRE KENOBI
    // ==========================================
    const construirActionCardsHtml = (actionCards = [], autoAppliedLogs = []) => {
        if ((!actionCards || actionCards.length === 0) && (!autoAppliedLogs || autoAppliedLogs.length === 0)) {
            return '';
        }

        let html = '<div class="kenobiCardsContainer">';

        // 1. Logs aplicados automaticamente (ex: dano automático em combate)
        (autoAppliedLogs || []).forEach((log) => {
            html += `
                <div class="kenobiAutoLogPill">
                    <span>⚡ <strong>Aplicado no Datapad:</strong> ${log.summary}</span>
                </div>
            `;
        });

        // 2. Cards interativos
        (actionCards || []).forEach((card) => {
            const status = card.status || 'pending';
            const isPending = status === 'pending';
            const isSkillCheck = card.action_type === 'skill_check';
            const isCombatPrompt = card.action_type === 'combat_mode_prompt';
            const isTradeOrCredits = card.action_type === 'trade' || card.action_type === 'credits';

            let dicePillsHtml = '';
            if (isSkillCheck && card.payload) {
                const p = card.payload;
                const pills = [];
                if (p.yellow > 0) pills.push(`<span class="dicePill yellow">${p.yellow} Amarelo(s) [Proficiência]</span>`);
                if (p.green > 0) pills.push(`<span class="dicePill green">${p.green} Verde(s) [Habilidade]</span>`);
                if (p.blue > 0) pills.push(`<span class="dicePill blue">${p.blue} Azul(is) [Ampliação]</span>`);
                if (p.red > 0) pills.push(`<span class="dicePill red">${p.red} Vermelho(s) [Desafio]</span>`);
                if (p.purple > 0) pills.push(`<span class="dicePill purple">${p.purple} Roxo(s) [Dificuldade]</span>`);
                if (p.black > 0) pills.push(`<span class="dicePill black">${p.black} Preto(s) [Contratempo]</span>`);
                if (p.white > 0) pills.push(`<span class="dicePill white">${p.white} Branco(s) [Força]</span>`);
                if (pills.length > 0) {
                    dicePillsHtml = `<div class="kenobiDicePills">${pills.join('')}</div>`;
                }
            }

            let badgeLabel = 'AGUARDANDO DECISÃO';
            if (status === 'confirmed') badgeLabel = '✓ CONFIRMADO';
            if (status === 'cancelled') badgeLabel = '✕ CANCELADO';
            if (status === 'negotiating') badgeLabel = '💬 EM NEGOCIAÇÃO';

            let buttonsHtml = '';
            if (isPending) {
                if (isCombatPrompt) {
                    buttonsHtml = `
                        <div class="kenobiCardButtons">
                            <button class="kenobiCardBtn confirm" data-card-action="combat_auto" data-card-id="${card.id}">
                                ⚔️ Automático nesta luta
                            </button>
                            <button class="kenobiCardBtn negotiate" data-card-action="combat_manual" data-card-id="${card.id}">
                                🛡️ Farei manualmente
                            </button>
                        </div>
                    `;
                } else if (isSkillCheck) {
                    const encodedPool = encodeURIComponent(JSON.stringify(card.payload || {}));
                    buttonsHtml = `
                        <div class="kenobiCardButtons">
                            <button class="kenobiCardBtn roll" data-card-action="roll_digital" data-card-id="${card.id}" data-pool="${encodedPool}">
                                🎲 Rolar Dados no Sistema
                            </button>
                            <button class="kenobiCardBtn negotiate" data-card-action="roll_physical" data-card-id="${card.id}" data-skill="${card.payload?.skillName || 'Perícia'}">
                                ✍️ Digitar Dados Físicos
                            </button>
                        </div>
                    `;
                } else {
                    buttonsHtml = `
                        <div class="kenobiCardButtons">
                            <button class="kenobiCardBtn confirm" data-card-action="confirm" data-card-id="${card.id}">
                                ✓ Confirmar
                            </button>
                            <button class="kenobiCardBtn cancel" data-card-action="cancel" data-card-id="${card.id}">
                                ✕ Cancelar
                            </button>
                            ${
                                isTradeOrCredits
                                    ? `<button class="kenobiCardBtn negotiate" data-card-action="negotiate" data-card-id="${card.id}">
                                        💬 Negociar
                                       </button>`
                                    : ''
                            }
                        </div>
                    `;
                }
            } else if (card.payload?.rollResult?.summaryPtBr) {
                buttonsHtml = `
                    <div class="kenobiAutoLogPill">
                        <span>🎲 ${card.payload.rollResult.summaryPtBr}</span>
                    </div>
                `;
            }

            html += `
                <div class="kenobiActionCard ${isSkillCheck ? 'skillCheckCard' : ''} ${!isPending ? 'resolvedCard' : ''}" data-card-box="${card.id}">
                    <div class="kenobiCardHeader">
                        <span class="kenobiCardTitle">${card.title}</span>
                        <span class="kenobiCardBadge" data-card-badge="${card.id}">${badgeLabel}</span>
                    </div>
                    <p class="kenobiCardDesc">${card.description}</p>
                    ${dicePillsHtml}
                    <div data-card-controls="${card.id}">
                        ${buttonsHtml}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    };

    // ==========================================
    // 4. LÓGICA DE ENVIO E LOADING DA IA
    // ==========================================
    let typingBubble = null;

    const appendMessage = (text, isUser = true, messageId = null, extraMeta = {}) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'userMessage' : 'aiMessage'}`;

        if (messageId) {
            messageDiv.setAttribute('data-id', messageId);
        }

        const textoSeguro = text || 'Sinto um distúrbio na Força. O sinal foi perdido.';

        if (isUser) {
            const displayBtn = messageId ? 'flex' : 'none';
            messageDiv.innerHTML = `
                <div class="messageContent">
                    <span class="textContent">${textoSeguro.replace(/\n/g, '<br>')}</span>
                </div>
                <div class="msgActions">
                    <button class="actionIconBtn editMsgBtn" style="display: ${displayBtn};" aria-label="Editar" title="Editar linha do tempo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="actionIconBtn copyMsgBtn" style="display: ${displayBtn};" aria-label="Copiar" title="Copiar mensagem">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                </div>
            `;
        } else {
            let htmlFormatado = `<p>${textoSeguro}</p>`;
            try {
                if (typeof marked !== 'undefined') {
                    htmlFormatado =
                        typeof marked.parse === 'function' ? marked.parse(textoSeguro) : marked(textoSeguro);
                }
            } catch (erroMarkdown) {
                console.error('Erro no tradutor:', erroMarkdown);
                htmlFormatado = `<p>${textoSeguro}</p>`;
            }

            const cardsHtml = construirActionCardsHtml(
                extraMeta.actionCards || [],
                extraMeta.autoAppliedLogs || []
            );

            messageDiv.innerHTML = `
                <div class="aiAvatar">
                    <img src="assets/img/obiwankenobiprofile.webp" alt="Kenobi">
                </div>
                <div class="aiContentWrapper">
                    <div class="messageContent markdown-body">
                        ${htmlFormatado}
                    </div>
                    ${cardsHtml}
                    <div class="msgActions">
                        <button class="actionIconBtn copyMsgBtn" aria-label="Copiar" title="Copiar resposta">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                    </div>
                </div>
            `;
        }

        messagesArea.appendChild(messageDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
        return messageDiv;
    };

    const showTypingIndicator = () => {
        typingBubble = document.createElement('div');
        typingBubble.className = 'message aiMessage';
        typingBubble.innerHTML = `
            <div class="aiAvatar">
                <img src="assets/img/obiwankenobiprofile.webp" alt="Kenobi">
            </div>
            <div class="messageContent">
                <div class="typingIndicator">
                    <div class="typingDot"></div>
                    <div class="typingDot"></div>
                    <div class="typingDot"></div>
                </div>
            </div>
        `;
        messagesArea.appendChild(typingBubble);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    };

    const removeTypingIndicator = () => {
        if (typingBubble) {
            typingBubble.remove();
            typingBubble = null;
        }
    };

    const setAiLoading = (isLoading) => {
        glowEffects.forEach((glow) => {
            if (isLoading) glow.classList.add('pulsingGlow');
            else glow.classList.remove('pulsingGlow');
        });
    };

    const handleSendMessage = async () => {
        const text = chatInput.value.trim();
        if (!text) return;

        if (!conversaAtualId) {
            const respostaNova = await API.criarConversa('Nova Transmissão...');
            if (respostaNova.sucesso) {
                conversaAtualId = respostaNova.dados.id;
                await renderizarHistorico();
                await atualizarBarraTatica();
            } else {
                console.error('Erro ao criar campanha para a mensagem.');
                return;
            }
        }

        const balaoUsuarioAtual = appendMessage(text, true);

        chatInput.value = '';
        chatInput.focus();
        if (typeof handleInputResize === 'function') handleInputResize();

        if (inputSection.classList.contains('expandedMode')) {
            document.getElementById('expandBtn').click();
        }

        setAiLoading(true);
        showTypingIndicator();

        try {
            const dadosIA = await API.enviarMensagemParaKenobi(conversaAtualId, text);
            const textoIA = dadosIA.resposta || dadosIA.narrative;
            const idMensagemUsuario = dadosIA.userMessageId;
            const idMensagemIA = dadosIA.aiMessageId;

            if (idMensagemUsuario && balaoUsuarioAtual) {
                balaoUsuarioAtual.setAttribute('data-id', idMensagemUsuario);
                const btnEditar = balaoUsuarioAtual.querySelector('.editMsgBtn');
                const btnCopiar = balaoUsuarioAtual.querySelector('.copyMsgBtn');
                if (btnEditar) btnEditar.style.display = 'flex';
                if (btnCopiar) btnCopiar.style.display = 'flex';
            }

            removeTypingIndicator();
            appendMessage(textoIA, false, idMensagemIA, {
                actionCards: dadosIA.actionCards || [],
                autoAppliedLogs: dadosIA.autoAppliedLogs || []
            });

            await atualizarBarraTatica();
        } catch (erro) {
            console.error('Distúrbio na Força:', erro);
            removeTypingIndicator();
            appendMessage(
                `Sinto um distúrbio na Força: ${erro.message || 'Não foi possível contatar o Mestre.'}`,
                false
            );
        } finally {
            setAiLoading(false);
        }
    };

    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', handleSendMessage);
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });
    }

    // ==========================================
    // 5. USUÁRIO LOGADO E TELA DE BOAS-VINDAS
    // ==========================================
    const loggedInUser = localStorage.getItem('obiwan_user') || 'Visitante';
    const loggedInTreatment = localStorage.getItem('obiwan_tratamento') || 'M';

    let saudacao = 'Bem-vindo';
    let tituloSideBar = 'Mestre';

    if (loggedInTreatment === 'F') {
        saudacao = 'Bem-vinda';
        tituloSideBar = 'Mestra';
    } else if (loggedInTreatment === 'N') {
        saudacao = 'Boas-vindas';
        tituloSideBar = 'Mestre(a)';
    }

    const sidebarUserName = document.getElementById('sidebarUserName');
    if (sidebarUserName) {
        sidebarUserName.textContent = `${tituloSideBar} (${loggedInUser})`;
    }

    const cinematicWelcome = document.getElementById('cinematicWelcome');
    const welcomeTitle = document.getElementById('welcomeTitle');

    if (cinematicWelcome && welcomeTitle) {
        const textToType = `${saudacao}, ${tituloSideBar} ${loggedInUser}.`;
        let charIndex = 0;

        setTimeout(() => {
            const typingInterval = setInterval(() => {
                if (charIndex < textToType.length) {
                    welcomeTitle.textContent += textToType.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    setTimeout(() => {
                        cinematicWelcome.classList.add('hide');
                        if (chatInput) chatInput.focus();
                    }, 1500);
                }
            }, 80);
        }, 1200);
    }

    // ==========================================
    // 6. LOGOUT
    // ==========================================
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            logoutBtn.innerHTML = 'Desconectando...';
            logoutBtn.style.opacity = '0.5';
            if (typeof API !== 'undefined') {
                await API.logout();
            }
            localStorage.removeItem('obiwan_user');
            window.location.href = 'index.html';
        });
    }

    // ==========================================
    // 7. HISTÓRICO E CAMPANHAS (CONECTADO AO SUPABASE UNIFICADO)
    // ==========================================
    const newChatBtn = document.getElementById('newChatBtn');
    const chatHistoryList = document.getElementById('chatHistoryList');

    const carregarConversa = async (id) => {
        conversaAtualId = id;
        renderizarHistorico();
        atualizarBarraTatica();

        if (messagesArea) {
            messagesArea.querySelectorAll('.message:not(.systemMsg)').forEach((msg) => msg.remove());
        }
        if (chatInput) chatInput.focus();

        const resposta = await API.obterMensagens(id);
        if (resposta.sucesso && resposta.dados.length > 0) {
            resposta.dados.forEach((msg) => {
                const isUser = msg.autor === 'user';
                appendMessage(msg.conteudo, isUser, msg.id, {
                    actionCards: msg.actionCards || [],
                    autoAppliedLogs: msg.autoAppliedLogs || []
                });
            });
        }
    };

    const renderizarHistorico = async () => {
        if (!chatHistoryList) return;
        chatHistoryList.innerHTML =
            '<li class="historyItem" style="justify-content:center; opacity:0.5;"><span class="navText">Buscando registros...</span></li>';

        const resposta = await API.obterConversas();
        if (!resposta.sucesso) {
            chatHistoryList.innerHTML =
                '<li class="historyItem" style="color:var(--danger); justify-content:center;"><span class="navText">Erro na rede segura.</span></li>';
            return;
        }

        chatHistoryList.innerHTML = '';

        if (resposta.dados.length === 0) {
            chatHistoryList.innerHTML =
                '<li class="historyItem" style="justify-content:center; opacity:0.5;"><span class="navText">Nenhuma transmissão ainda.</span></li>';
            return;
        }

        // Se nenhuma conversa estiver selecionada ainda, abre automaticamente a primeira!
        if (!conversaAtualId && resposta.dados.length > 0) {
            conversaAtualId = resposta.dados[0].id;
            carregarConversa(conversaAtualId);
            return;
        }

        resposta.dados.forEach((conversa) => {
            const isFixado = conversa.fixado;
            const iconSvg = isFixado
                ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 11.2V6a3 3 0 0 0-6 0v5.2a2 2 0 0 1-1.11 1.35l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>`
                : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;

            const li = document.createElement('li');
            li.className = 'historyItem';
            if (conversaAtualId === conversa.id) li.style.background = 'rgba(255,255,255,0.1)';

            li.setAttribute('data-id', conversa.id);
            li.setAttribute('data-fixado', isFixado);

            li.innerHTML = `
                <span class="chatIcon">${iconSvg}</span>
                <span class="chatTitle" title="${conversa.titulo}">${conversa.titulo}</span>
                
                <button class="optionsBtn" aria-label="Opções">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                </button>

                <div class="chatDropdown">
                    <button class="dropdownItem action-pin">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 11.2V6a3 3 0 0 0-6 0v5.2a2 2 0 0 1-1.11 1.35l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
                        ${isFixado ? 'Desfixar' : 'Fixar'}
                    </button>
                    <button class="dropdownItem action-rename">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Renomear
                    </button>
                    <button class="dropdownItem danger action-delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        Excluir
                    </button>
                </div>
            `;
            chatHistoryList.appendChild(li);
        });
    };

    renderizarHistorico();

    const iniciarNovaConversa = async () => {
        if (messagesArea) {
            messagesArea.querySelectorAll('.message:not(.systemMsg)').forEach((msg) => msg.remove());
        }
        if (chatInput) {
            chatInput.value = '';
            chatInput.style.height = 'auto';
            chatInput.focus();
        }
        if (expandBtn) expandBtn.classList.add('hidden');

        const resposta = await API.criarConversa('Nova Aventura...');
        if (resposta.sucesso) {
            conversaAtualId = resposta.dados.id;
            await renderizarHistorico();
            await atualizarBarraTatica();
        }
    };

    if (newChatBtn) newChatBtn.addEventListener('click', iniciarNovaConversa);

    const fixarConversa = async (id, estadoAtual) => {
        const novoEstado = estadoAtual !== 'true';
        await API.atualizarConversa(id, { fixado: novoEstado });
        renderizarHistorico();
    };

    // ==========================================
    // 8. MODAIS (RENOMEAR, EXCLUIR, FICHAS, DIÁRIO CANÔNICO, AUTOMAÇÃO)
    // ==========================================
    const renameModal = document.getElementById('renameModal');
    const deleteModal = document.getElementById('deleteModal');
    const renameModalInput = document.getElementById('renameModalInput');
    let chatAlvoId = null;

    document.querySelectorAll('.cancelModalBtn').forEach((btn) => {
        btn.addEventListener('click', () => {
            if (renameModal) renameModal.classList.remove('show');
            if (deleteModal) deleteModal.classList.remove('show');
            if (sheetsModal) sheetsModal.classList.remove('show');
            if (canonModal) canonModal.classList.remove('show');
            if (automationModal) automationModal.classList.remove('show');
            chatAlvoId = null;
        });
    });

    const renomearConversa = (id) => {
        chatAlvoId = id;
        renameModalInput.value = '';
        renameModal.classList.add('show');
        setTimeout(() => renameModalInput.focus(), 100);
    };

    const excluirConversa = (id) => {
        chatAlvoId = id;
        deleteModal.classList.add('show');
    };

    document.getElementById('confirmRenameBtn').addEventListener('click', async () => {
        const novoNome = renameModalInput.value.trim();
        if (novoNome !== '') {
            await API.atualizarConversa(chatAlvoId, { titulo: novoNome });
            renderizarHistorico();
        }
        renameModal.classList.remove('show');
        chatAlvoId = null;
    });

    document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
        await API.excluirConversa(chatAlvoId);
        if (conversaAtualId === chatAlvoId) {
            conversaAtualId = null;
            if (messagesArea) {
                messagesArea.querySelectorAll('.message:not(.systemMsg)').forEach((msg) => msg.remove());
            }
        }
        renderizarHistorico();
        atualizarBarraTatica();
        deleteModal.classList.remove('show');
        chatAlvoId = null;
    });

    // 8B. Modal de Fichas do Datapad na Campanha
    const abrirModalFichas = async () => {
        if (!conversaAtualId) {
            await iniciarNovaConversa();
        }
        if (!sheetsModal || !sheetsModalList) return;
        sheetsModal.classList.add('show');
        sheetsModalList.innerHTML = '<p class="modalText">Sincronizando fichas com o Nocturne Datapad...</p>';

        const res = await API.obterFichasDaCampanha(conversaAtualId);
        const idsVinculados = new Set((res.vinculadas || []).map((v) => v.characterId));

        sheetsModalList.innerHTML = '';

        // 1. Mostra fichas de parceiros (ex: Nayla) vinculadas pelo código
        (res.vinculadas || [])
            .filter((v) => !v.isOwnCharacter)
            .forEach((parceiro) => {
                const ent = parceiro.entity;
                const row = document.createElement('div');
                row.className = 'sheetModalRow';
                row.innerHTML = `
                    <div class="sheetModalInfo">
                        <span class="sheetModalName">✨ ${ent.name} (Conta Parceira)</span>
                        <span class="sheetModalMeta">${ent.species || ''} ${ent.career || ''} • ❤️ ${ent.wounds?.current ?? 0}/${ent.wounds?.threshold ?? 10} • ⚡ ${ent.strain?.current ?? 0}/${ent.strain?.threshold ?? 10}</span>
                    </div>
                    <span class="kenobiCardBadge">VINCULADA</span>
                `;
                sheetsModalList.appendChild(row);
            });

        // 2. Mostra todas as fichas da própria conta do usuário para ligar/desligar com 1 clique
        if ((res.minhasFichas || []).length === 0) {
            sheetsModalList.innerHTML +=
                '<p class="modalText">Nenhuma ficha encontrada na sua conta do Datapad.</p>';
            return;
        }

        res.minhasFichas.forEach((item) => {
            const ent = item.entity;
            const isLinked = idsVinculados.has(item.characterId);
            const tipoLabel =
                ent.entityType === 'ship'
                    ? '🚀 Nave'
                    : ent.entityType === 'npc'
                    ? '🎭 NPC'
                    : '⚔️ Operativo';

            const row = document.createElement('div');
            row.className = 'sheetModalRow';
            row.innerHTML = `
                <div class="sheetModalInfo">
                    <span class="sheetModalName">${tipoLabel}: ${ent.name}</span>
                    <span class="sheetModalMeta">${
                        ent.entityType === 'ship'
                            ? `${ent.hullType || 'Nave'} • Casco ${ent.hullTrauma?.current ?? 0}/${ent.hullTrauma?.threshold ?? 15}`
                            : `${ent.species || ''} ${ent.career || ent.role || ''} • Ferimentos ${ent.wounds?.current ?? 0}/${ent.wounds?.threshold ?? 10}`
                    }</span>
                </div>
                <button class="kenobiCardBtn ${isLinked ? 'cancel' : 'confirm'}" data-toggle-sheet="${item.characterId}" data-entity-type="${ent.entityType || 'pc'}" data-linked="${isLinked}">
                    ${isLinked ? 'Remover da Cena' : '+ Colocar em Cena'}
                </button>
            `;
            sheetsModalList.appendChild(row);
        });
    };

    if (manageSheetsBtn) {
        manageSheetsBtn.addEventListener('click', abrirModalFichas);
    }

    if (sheetsModalList) {
        sheetsModalList.addEventListener('click', async (e) => {
            const btn = e.target.closest('[data-toggle-sheet]');
            if (!btn || !conversaAtualId) return;
            const charId = btn.getAttribute('data-toggle-sheet');
            const entityType = btn.getAttribute('data-entity-type') || 'pc';
            const currentlyLinked = btn.getAttribute('data-linked') === 'true';

            btn.disabled = true;
            btn.textContent = 'Sincronizando...';
            await API.alternarVinculoMinhaFicha(conversaAtualId, charId, entityType, !currentlyLinked);
            await abrirModalFichas();
            await atualizarBarraTatica();
        });
    }

    // 8C. Modal do Diário Canônico (Camada 2 de Memória)
    if (openCanonBtn && canonModal) {
        openCanonBtn.addEventListener('click', async () => {
            if (!conversaAtualId) await iniciarNovaConversa();
            const res = await API.obterCampanhaPorId(conversaAtualId);
            if (res.sucesso && res.dados) {
                campanhaAtualObj = res.dados;
                canonSummaryTextarea.value = res.dados.canon_summary || '';
            }
            canonModal.classList.add('show');
        });
    }

    if (saveCanonBtn) {
        saveCanonBtn.addEventListener('click', async () => {
            if (!conversaAtualId) return;
            saveCanonBtn.textContent = 'Salvando...';
            await API.atualizarConversa(conversaAtualId, {
                canon_summary: canonSummaryTextarea.value.trim()
            });
            saveCanonBtn.textContent = 'Salvar no Holocron';
            canonModal.classList.remove('show');
            atualizarBarraTatica();
        });
    }

    // 8D. Modal de Preferências de Automação (Mão Dupla Configurável)
    if (openAutomationBtn && automationModal) {
        openAutomationBtn.addEventListener('click', async () => {
            if (!conversaAtualId) await iniciarNovaConversa();
            const res = await API.obterCampanhaPorId(conversaAtualId);
            if (res.sucesso && res.dados) {
                campanhaAtualObj = res.dados;
                const prefs = res.dados.automation_prefs || {};
                if (prefEnabled) prefEnabled.value = String(prefs.enabled !== false);
                if (prefCombat) prefCombat.value = prefs.combat_damage || 'ask_on_combat_start';
                if (prefItems) prefItems.value = prefs.items || 'confirm_card';
                if (prefCredits) prefCredits.value = prefs.credits || 'confirm_card';
                if (prefXp) prefXp.value = prefs.xp || 'manual';
            }
            automationModal.classList.add('show');
        });
    }

    if (saveAutomationBtn) {
        saveAutomationBtn.addEventListener('click', async () => {
            if (!conversaAtualId) return;
            saveAutomationBtn.textContent = 'Salvando...';
            const nextPrefs = {
                enabled: prefEnabled.value === 'true',
                combat_damage: prefCombat.value,
                combat_strain: prefCombat.value,
                items: prefItems.value,
                credits: prefCredits.value,
                xp: prefXp.value
            };
            await API.atualizarConversa(conversaAtualId, {
                automation_prefs: nextPrefs
            });
            saveAutomationBtn.textContent = 'Salvar Preferências';
            automationModal.classList.remove('show');
            atualizarBarraTatica();
        });
    }

    // ==========================================
    // 9. CLIQUES NA BARRA LATERAL
    // ==========================================
    if (chatHistoryList) {
        chatHistoryList.addEventListener('click', (e) => {
            const optionsBtn = e.target.closest('.optionsBtn');
            if (optionsBtn) {
                e.stopPropagation();
                const liContainer = optionsBtn.closest('.historyItem');
                const dropdown = liContainer.querySelector('.chatDropdown');

                document.querySelectorAll('.chatDropdown.show').forEach((menu) => {
                    if (menu !== dropdown) menu.classList.remove('show');
                });
                dropdown.classList.toggle('show');
                return;
            }

            const dropdownItem = e.target.closest('.dropdownItem');
            if (dropdownItem) {
                e.stopPropagation();
                const liContainer = dropdownItem.closest('.historyItem');
                const chatId = liContainer.getAttribute('data-id');
                const estadoFixado = liContainer.getAttribute('data-fixado');

                if (dropdownItem.classList.contains('action-pin')) fixarConversa(chatId, estadoFixado);
                if (dropdownItem.classList.contains('action-rename')) renomearConversa(chatId);
                if (dropdownItem.classList.contains('action-delete')) excluirConversa(chatId);

                liContainer.querySelector('.chatDropdown').classList.remove('show');
                return;
            }

            const historyItem = e.target.closest('.historyItem');
            if (historyItem) {
                const chatId = historyItem.getAttribute('data-id');
                if (chatId && chatId !== conversaAtualId) {
                    carregarConversa(chatId);
                }
            }
        });
    }

    document.addEventListener('click', () => {
        document.querySelectorAll('.chatDropdown.show').forEach((menu) => {
            menu.classList.remove('show');
        });
    });

    // ==========================================
    // 10. INTERAÇÃO NAS MENSAGENS (ACTION CARDS, MÁQUINA DO TEMPO E COPIAR)
    // ==========================================
    if (messagesArea) {
        messagesArea.addEventListener('click', async (e) => {
            // ----------------------------------------------------
            // A. CLIQUE EM BOTÃO DE ACTION CARD DO MESTRE KENOBI
            // ----------------------------------------------------
            const cardBtn = e.target.closest('[data-card-action]');
            if (cardBtn) {
                const cardAction = cardBtn.getAttribute('data-card-action');
                const cardId = cardBtn.getAttribute('data-card-id');
                const controlsDiv = messagesArea.querySelector(`[data-card-controls="${cardId}"]`);
                const badgeEl = messagesArea.querySelector(`[data-card-badge="${cardId}"]`);
                const cardBox = messagesArea.querySelector(`[data-card-box="${cardId}"]`);

                // A.1 Digitar Rolagem Física (Preenche o input do chat para o jogador digitar os símbolos)
                if (cardAction === 'roll_physical') {
                    const skillName = cardBtn.getAttribute('data-skill') || 'Perícia';
                    chatInput.value = `Rolagem de ${skillName}: `;
                    chatInput.focus();
                    handleInputResize();
                    return;
                }

                // A.2 Rolar Dados Digitais no Sistema
                if (cardAction === 'roll_digital') {
                    const encodedPool = cardBtn.getAttribute('data-pool') || '';
                    let pool = null;
                    try {
                        pool = JSON.parse(decodeURIComponent(encodedPool));
                    } catch {
                        pool = null;
                    }
                    cardBtn.disabled = true;
                    cardBtn.textContent = 'Rolando dados da Força...';
                    try {
                        const res = await API.rolarTesteDePericia(cardId, pool);
                        if (badgeEl) badgeEl.textContent = '✓ ROLADO';
                        if (cardBox) cardBox.classList.add('resolvedCard');
                        if (controlsDiv) {
                            controlsDiv.innerHTML = `
                                <div class="kenobiAutoLogPill">
                                    <span>${res.suggestedPlayerMessage}</span>
                                </div>
                            `;
                        }
                        // Joga o resultado no chat e envia pro Mestre Kenobi narrar a consequência!
                        chatInput.value = res.suggestedPlayerMessage;
                        await handleSendMessage();
                    } catch (err) {
                        cardBtn.disabled = false;
                        cardBtn.textContent = '🎲 Rolar Dados no Sistema';
                        alert(err.message || 'Erro ao rolar dados.');
                    }
                    return;
                }

                // A.3 Confirmar / Cancelar / Negociar / Modo de Combate
                cardBtn.disabled = true;
                const oldLabel = cardBtn.textContent;
                cardBtn.textContent = 'Processando...';

                try {
                    const res = await API.resolverActionCard(cardId, cardAction);
                    if (cardBox) cardBox.classList.add('resolvedCard');

                    if (cardAction === 'cancel') {
                        if (badgeEl) badgeEl.textContent = '✕ CANCELADO';
                        if (controlsDiv) {
                            controlsDiv.innerHTML = `<span class="partySheetStats">${res.message}</span>`;
                        }
                    } else if (cardAction === 'negotiate') {
                        if (badgeEl) badgeEl.textContent = '💬 NEGOCIANDO';
                        if (controlsDiv) {
                            controlsDiv.innerHTML = `<span class="partySheetStats">${res.message}</span>`;
                        }
                        if (res.suggestedPlayerMessage) {
                            chatInput.value = res.suggestedPlayerMessage;
                            chatInput.focus();
                            handleInputResize();
                        }
                    } else {
                        if (badgeEl) badgeEl.textContent = '✓ APLICADO NO DATAPAD';
                        if (controlsDiv) {
                            controlsDiv.innerHTML = `
                                <div class="kenobiAutoLogPill">
                                    <span>⚡ ${res.message}</span>
                                </div>
                            `;
                        }
                        await atualizarBarraTatica();
                    }
                } catch (err) {
                    cardBtn.disabled = false;
                    cardBtn.textContent = oldLabel;
                    alert(err.message || 'Erro ao aplicar ação na ficha.');
                }
                return;
            }

            // ----------------------------------------------------
            // B. CLIQUE NO BOTÃO DE LÁPIS (Máquina do Tempo Inline)
            // ----------------------------------------------------
            const editBtn = e.target.closest('.editMsgBtn');
            if (editBtn) {
                const messageDiv = editBtn.closest('.message');
                const contentContainer = messageDiv.querySelector('.messageContent');
                const textSpan = messageDiv.querySelector('.textContent');

                if (contentContainer.querySelector('.inlineEditForm')) return;

                const originalText = textSpan.innerText;
                editBtn.style.display = 'none';
                textSpan.style.display = 'none';

                const editForm = document.createElement('div');
                editForm.className = 'inlineEditForm';
                editForm.innerHTML = `
                    <textarea class="inlineEditTextarea">${originalText}</textarea>
                    <div class="inlineEditActions">
                        <button class="cancelEditBtn">Cancelar</button>
                        <button class="saveEditBtn">Atualizar</button>
                    </div>
                `;

                contentContainer.appendChild(editForm);

                const textarea = editForm.querySelector('textarea');
                textarea.style.height = textarea.scrollHeight + 'px';
                textarea.addEventListener('input', () => {
                    textarea.style.height = 'auto';
                    textarea.style.height = textarea.scrollHeight + 'px';
                });

                textarea.focus();
                textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
                return;
            }

            // ----------------------------------------------------
            // C. CLIQUE EM CANCELAR EDIÇÃO
            // ----------------------------------------------------
            const cancelBtn = e.target.closest('.cancelEditBtn');
            if (cancelBtn) {
                const messageDiv = cancelBtn.closest('.message');
                const textSpan = messageDiv.querySelector('.textContent');
                const editBtnPencil = messageDiv.querySelector('.editMsgBtn');
                const editForm = messageDiv.querySelector('.inlineEditForm');

                editForm.remove();
                textSpan.style.display = 'block';
                editBtnPencil.style.display = 'flex';
                return;
            }

            // ----------------------------------------------------
            // D. CLIQUE EM ATUALIZAR (Poda o banco + memórias futuras e reenvia)
            // ----------------------------------------------------
            const saveBtn = e.target.closest('.saveEditBtn');
            if (saveBtn) {
                const messageDiv = saveBtn.closest('.message');
                const messageId = messageDiv.getAttribute('data-id');
                const editForm = messageDiv.querySelector('.inlineEditForm');
                const textarea = editForm.querySelector('textarea');
                const newText = textarea.value.trim();

                if (!newText) return;

                saveBtn.textContent = 'Ajustando o tempo...';
                saveBtn.disabled = true;
                textarea.disabled = true;

                if (messageId && typeof API.voltarNoTempo === 'function') {
                    const resPoda = await API.voltarNoTempo(messageId);
                    if (!resPoda.sucesso) {
                        console.error('Erro na poda da linha do tempo:', resPoda.erro);
                        saveBtn.textContent = 'Atualizar';
                        saveBtn.disabled = false;
                        textarea.disabled = false;
                        return;
                    }
                }

                let sibling = messageDiv;
                while (sibling) {
                    let next = sibling.nextElementSibling;
                    sibling.remove();
                    sibling = next;
                }

                if (chatInput) {
                    chatInput.value = newText;
                    handleInputResize();
                    handleSendMessage();
                }
                return;
            }

            // ----------------------------------------------------
            // E. CLIQUE NO BOTÃO DE COPIAR (USER & IA)
            // ----------------------------------------------------
            const copyBtn = e.target.closest('.copyMsgBtn');
            if (copyBtn) {
                const messageDiv = copyBtn.closest('.message');
                const isUser = messageDiv.classList.contains('userMessage');

                let plainText = '';
                let htmlText = '';

                if (isUser) {
                    const textSpan = messageDiv.querySelector('.textContent');
                    plainText = textSpan.innerText;
                    htmlText = textSpan.innerHTML;
                } else {
                    const markdownBody = messageDiv.querySelector('.markdown-body');
                    plainText = markdownBody.innerText;
                    htmlText = markdownBody.innerHTML;
                }

                try {
                    if (navigator.clipboard && window.ClipboardItem) {
                        const htmlBlob = new Blob([htmlText], { type: 'text/html' });
                        const textBlob = new Blob([plainText], { type: 'text/plain' });
                        const clipboardItem = new ClipboardItem({
                            'text/html': htmlBlob,
                            'text/plain': textBlob
                        });
                        await navigator.clipboard.write([clipboardItem]);
                    } else {
                        await navigator.clipboard.writeText(plainText);
                    }

                    const originalHTML = copyBtn.innerHTML;
                    copyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                    setTimeout(() => {
                        copyBtn.innerHTML = originalHTML;
                    }, 2000);
                } catch (err) {
                    console.error('Falha ao copiar da Força: ', err);
                }
            }
        });
    }
});
