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
    // 2. LÓGICA DO PAINEL LATERAL (CONFIGURAÇÕES)
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

    // ==========================================
    // RESPONSIVIDADE: ABRIR/FECHAR SIDEBAR MOBILE
    // ==========================================
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    // Se não existir um overlay escuro exclusivo para a sidebar, usamos o mesmo de configurações
    const mobileOverlay = document.getElementById('settingsOverlay'); 

    if (menuToggle && sidebar) {
        const toggleSidebar = () => {
            sidebar.classList.toggle('open');
            if (window.innerWidth <= 768) {
                mobileOverlay.classList.toggle('active');
            }
        };

        menuToggle.addEventListener('click', toggleSidebar);
        
        // Fecha a sidebar ao clicar na parte escura (fora dela) no mobile
        mobileOverlay.addEventListener('click', () => {
            if (sidebar.classList.contains('open') && window.innerWidth <= 768) {
                toggleSidebar();
            }
        });
    }

    // ==========================================
    // 3. LÓGICA DE ENVIO E LOADING DA IA
    // ==========================================
    
    // Variável para guardar o balão de digitação e podermos apagá-lo depois
    let typingBubble = null;

    // Constrói o HTML da nova mensagem e joga na tela
    const appendMessage = (text, isUser = true) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'userMessage' : 'aiMessage'}`;

        if (isUser) {
            // Mensagem do usuário (mantém simples, só quebrando linha)
            messageDiv.innerHTML = `<div class="messageContent">${text.replace(/\n/g, '<br>')}</div>`;
        } else {
            // Mensagem da IA: Onde a mágica acontece.
            // O marked.parse traduz o texto do n8n, e a classe markdown-body aplica o estilo Gemini
            const htmlFormatado = typeof marked !== 'undefined' ? marked.parse(text) : `<p>${text}</p>`;

            messageDiv.innerHTML = `
                <div class="aiAvatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 10 c0-5 3-7 7-7 5 0 7 2.5 7 6 0 1.5-.5 3-1 4 -1-2-3.5-3-6-3 -2 0-4 1-5 2.5 C5.5 11.5 5 10.5 5 10 Z" />
                        <path d="M6.5 11.5 v2.5 c0 3 2.5 5.5 5.5 5.5 s5.5-2.5 5.5-5.5 v-2.5" />
                        <path d="M9.5 15.5 Q12 14 14.5 15.5" />
                        <line x1="12" y1="16.5" x2="12" y2="19.5" />
                    </svg>
                </div>
                <div class="messageContent markdown-body">
                    ${htmlFormatado}
                </div>
            `;
        }

        messagesArea.appendChild(messageDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    };

    // Mostra o balão com os 3 pontinhos
    const showTypingIndicator = () => {
        typingBubble = document.createElement('div');
        typingBubble.className = 'message aiMessage';
        
        typingBubble.innerHTML = `
            <div class="aiAvatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 10 c0-5 3-7 7-7 5 0 7 2.5 7 6 0 1.5-.5 3-1 4 -1-2-3.5-3-6-3 -2 0-4 1-5 2.5 C5.5 11.5 5 10.5 5 10 Z" />
                    <path d="M6.5 11.5 v2.5 c0 3 2.5 5.5 5.5 5.5 s5.5-2.5 5.5-5.5 v-2.5" />
                    <path d="M9.5 15.5 Q12 14 14.5 15.5" />
                    <line x1="12" y1="16.5" x2="12" y2="19.5" />
                </svg>
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

    // Remove o balão com os 3 pontinhos
    const removeTypingIndicator = () => {
        if (typingBubble) {
            typingBubble.remove();
            typingBubble = null;
        }
    };

    // Liga ou desliga a animação das luzes
    const setAiLoading = (isLoading) => {
        glowEffects.forEach(glow => {
            if (isLoading) {
                glow.classList.add('pulsingGlow');
            } else {
                glow.classList.remove('pulsingGlow');
            }
        });
    };

    const handleSendMessage = async () => {
        const text = chatInput.value.trim();
        if (!text) return; 

        // TRAVA DE SEGURANÇA: Se não houver conversa ativa, cria uma na hora
        if (!conversaAtualId) {
            const respostaNova = await API.criarConversa("Nova Transmissão...");
            if (respostaNova.sucesso) {
                conversaAtualId = respostaNova.dados.id;
                renderizarHistorico(); // Atualiza o menu lateral
            } else {
                console.error("Erro ao criar conversa para a mensagem.");
                return;
            }
        }

        // 1. Envia a mensagem do usuário (Visual)
        appendMessage(text, true);

        // 2. Limpa o input
        chatInput.value = '';
        chatInput.focus();
        handleInputResize();
        
        if (inputSection.classList.contains('expandedMode')) {
            document.getElementById('expandBtn').click(); 
        }

        // 3. SALVA A MENSAGEM DO USUÁRIO NO BANCO!
        //await API.salvarMensagem(conversaAtualId, 'user', text);

        // 4. Ativa o "pensamento" da IA e mostra os pontinhos
        setAiLoading(true);
        showTypingIndicator();

        try {
            // 5. Chamada real para o n8n via Webhook POST
            const respostaN8n = await fetch(CONFIG.N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'maquiagemdaheloisa': 'pretty little liars' 
                },
                body: JSON.stringify({
                    mensagem: text,
                    conversaId: conversaAtualId
                })
            });

            if (!respostaN8n.ok) {
                throw new Error("Erro na comunicação com a Força (n8n).");
            }

            // Captura o JSON devolvido pelo node 'Respond to Webhook' do n8n
            const dadosIA = await respostaN8n.json(); 
            const textoIA = dadosIA.resposta; 

            removeTypingIndicator(); // Apaga os pontinhos
            
            // Desenha a resposta da IA na tela
            appendMessage(textoIA, false);
            
            // SALVA A RESPOSTA DA IA NO BANCO!
            await API.salvarMensagem(conversaAtualId, 'ia', textoIA);
            
        } catch (erro) {
            console.error("Distúrbio na Força:", erro);
            removeTypingIndicator();
            appendMessage("Sinto um distúrbio na Força. Não foi possível contatar o Mestre.", false);
        } finally {
            setAiLoading(false); // Para o brilho
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
    // LÓGICA DO USUÁRIO LOGADO E TELA DE BOAS-VINDAS
    // ==========================================
    const loggedInUser = localStorage.getItem('obiwan_user') || "Visitante"; 
    const loggedInTreatment = localStorage.getItem('obiwan_tratamento') || "M";

    // Define a saudação baseada no tratamento
    let saudacao = "Bem-vindo"; // Padrão 'M'
    let tituloSideBar = "Mestre";

    if (loggedInTreatment === "F") {
        saudacao = "Bem-vinda";
        tituloSideBar = "Mestra";
    } else if (loggedInTreatment === "N") {
        saudacao = "Boas-vindas";
        tituloSideBar = "Mestre(a)";
    }

    const sidebarUserName = document.getElementById('sidebarUserName');
    if (sidebarUserName) {
        sidebarUserName.textContent = `${tituloSideBar} (${loggedInUser})`;
    }

    const cinematicWelcome = document.getElementById('cinematicWelcome');
    const welcomeTitle = document.getElementById('welcomeTitle');
    
    if (cinematicWelcome && welcomeTitle) {
        // A saudação personalizada que criamos
        const textToType = `${saudacao}, ${tituloSideBar} ${loggedInUser}.`;
        let charIndex = 0;

        // A Lógica da animação de digitação que havia sumido:
        setTimeout(() => {
            const typingInterval = setInterval(() => {
                if (charIndex < textToType.length) {
                    welcomeTitle.textContent += textToType.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    setTimeout(() => {
                        cinematicWelcome.classList.add('hide'); // <--- É isso que faz a tela preta sumir!
                        if(chatInput) chatInput.focus();
                    }, 1500); 
                }
            }, 80); 
        }, 1200); 
    }

    // ==========================================
    // 5. LÓGICA DE LOGOUT
    // ==========================================
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            // Efeito visual enquanto sai
            logoutBtn.innerHTML = "Desconectando...";
            logoutBtn.style.opacity = "0.5";

            // 1. Desloga oficialmente do Supabase
            if (typeof API !== 'undefined') {
                await API.logout();
            }
            
            // 2. Limpa o nome salvo na memória do navegador
            localStorage.removeItem('obiwan_user');
            
            // 3. Redireciona de volta para a tela de login
            window.location.href = 'index.html';
        });
    }

    // ==========================================
    // NOVA CONVERSA E HISTÓRICO AVANÇADO (CONECTADO AO SUPABASE)
    // ==========================================

    const newChatBtn = document.getElementById('newChatBtn');
    const chatHistoryList = document.getElementById('chatHistoryList');
    
    // Variável para saber em qual conversa estamos digitando no momento
    let conversaAtualId = null; 

    // 1. Renderizar o Histórico Real do Banco de Dados
    const renderizarHistorico = async () => {
        if (!chatHistoryList) return;
        
        chatHistoryList.innerHTML = '<li class="historyItem" style="justify-content:center; opacity:0.5;">Buscando registros...</li>';
        
        const resposta = await API.obterConversas();
        
        if (!resposta.sucesso) {
            chatHistoryList.innerHTML = '<li class="historyItem" style="color:var(--danger); justify-content:center;">Erro na rede segura.</li>';
            return;
        }

        chatHistoryList.innerHTML = ''; // Limpa a lista

        if (resposta.dados.length === 0) {
            chatHistoryList.innerHTML = '<li class="historyItem" style="justify-content:center; opacity:0.5;">Nenhuma transmissão ainda.</li>';
            return;
        }

        // Constrói cada item da lista (<li>) com os dados reais
        resposta.dados.forEach(conversa => {
            const isFixado = conversa.fixado;
            
            // Define o ícone de pino cheio se for fixado, senão balão de chat
            const iconSvg = isFixado 
                ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 11.2V6a3 3 0 0 0-6 0v5.2a2 2 0 0 1-1.11 1.35l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>`
                : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;

            const li = document.createElement('li');
            li.className = 'historyItem';
            if (conversaAtualId === conversa.id) li.style.background = 'rgba(255,255,255,0.1)'; // Destaca a conversa ativa
            
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

    // Puxa o histórico assim que o código carrega
    renderizarHistorico();

    // 2. Função: Iniciar Nova Conversa (Agora cria no banco)
    const iniciarNovaConversa = async () => {
        // Limpa a tela central
        if (messagesArea) {
            const mensagens = messagesArea.querySelectorAll('.message:not(.systemMsg)');
            mensagens.forEach(msg => msg.remove());
        }
        if (chatInput) {
            chatInput.value = '';
            chatInput.style.height = 'auto'; 
            chatInput.focus();
        }
        if (expandBtn) expandBtn.classList.add('hidden');

        // Cria no banco
        const tituloInicial = "Nova Aventura...";
        const resposta = await API.criarConversa(tituloInicial);
        
        if(resposta.sucesso) {
            conversaAtualId = resposta.dados.id; // Atualiza a mira para a nova conversa
            renderizarHistorico(); // Recarrega a barra lateral
        }
    };

    if (newChatBtn) newChatBtn.addEventListener('click', iniciarNovaConversa);

    // 3. Funções de Ação conectadas à API
    const fixarConversa = async (id, estadoAtual) => {
        const novoEstado = estadoAtual !== 'true'; // Inverte o status atual
        await API.atualizarConversa(id, { fixado: novoEstado });
        renderizarHistorico();
    };

    // ==========================================
    // MODAIS CUSTOMIZADOS (LÓGICA E INTEGRAÇÃO)
    // ==========================================
    const renameModal = document.getElementById('renameModal');
    const deleteModal = document.getElementById('deleteModal');
    const renameModalInput = document.getElementById('renameModalInput');
    
    // Variável para guardar qual chat o usuário está tentando modificar
    let chatAlvoId = null;

    // A. Fechar modais ao clicar em "Cancelar"
    document.querySelectorAll('.cancelModalBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            renameModal.classList.remove('show');
            deleteModal.classList.remove('show');
            chatAlvoId = null;
        });
    });

    // B. Substituição da função: Abre modal de Renomear
    const renomearConversa = (id) => {
        chatAlvoId = id;
        renameModalInput.value = ''; // Limpa o input sempre que abre
        renameModal.classList.add('show');
        
        // Foca automaticamente no campo para o usuário já sair digitando
        setTimeout(() => renameModalInput.focus(), 100); 
    };

    // C. Substituição da função: Abre modal de Excluir
    const excluirConversa = (id) => {
        chatAlvoId = id;
        deleteModal.classList.add('show');
    };

    // D. Botão Salvar (Renomear) - Já com a API do Supabase!
    document.getElementById('confirmRenameBtn').addEventListener('click', async () => {
        const novoNome = renameModalInput.value.trim();
        
        if (novoNome !== "") {
            // Usa a função do seu dev para salvar no banco
            await API.atualizarConversa(chatAlvoId, { titulo: novoNome });
            renderizarHistorico();
        }
        
        renameModal.classList.remove('show');
        chatAlvoId = null;
    });

    // E. Botão Excluir - Já com a API do Supabase!
    document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
        // Usa a função do seu dev para apagar do banco
        await API.excluirConversa(chatAlvoId);
        
        // Se apagou a conversa que estava olhando, limpa a tela principal
        if (conversaAtualId === chatAlvoId) {
            conversaAtualId = null;
            if (messagesArea) {
                messagesArea.querySelectorAll('.message:not(.systemMsg)').forEach(msg => msg.remove());
            }
        }
        renderizarHistorico();
        
        deleteModal.classList.remove('show');
        chatAlvoId = null;
    });

    // 4. Lógica de Cliques na Barra Lateral (Opções e Abrir Conversa)
    
    // Nova Função: Carregar mensagens da conversa clicada
    const carregarConversa = async (id) => {
        conversaAtualId = id;
        renderizarHistorico(); // Chama para atualizar a cor de "ativo" na lista lateral
        
        // Limpa a tela central
        if (messagesArea) {
            messagesArea.querySelectorAll('.message:not(.systemMsg)').forEach(msg => msg.remove());
        }

        // Se o chatInput estava escondido (se implementarmos isso depois), garante que apareça
        if (chatInput) chatInput.focus();

        // Busca no banco de dados
        const resposta = await API.obterMensagens(id);
        
        if (resposta.sucesso && resposta.dados.length > 0) {
            // Desenha as mensagens antigas na tela
            resposta.dados.forEach(msg => {
                const isUser = msg.autor === 'user'; // Verifica se foi você ou a IA
                appendMessage(msg.conteudo, isUser);
            });
        }
    };

    if (chatHistoryList) {
        chatHistoryList.addEventListener('click', (e) => {
            
            // A) Clicou nos 3 pontinhos
            const optionsBtn = e.target.closest('.optionsBtn');
            if (optionsBtn) {
                e.stopPropagation(); 
                const liContainer = optionsBtn.closest('.historyItem');
                const dropdown = liContainer.querySelector('.chatDropdown');
                
                document.querySelectorAll('.chatDropdown.show').forEach(menu => {
                    if (menu !== dropdown) menu.classList.remove('show');
                });
                
                dropdown.classList.toggle('show');
                return;
            }

            // B) Clicou em alguma das opções do menu Dropdown (Fixar, Renomear, Excluir)
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

            // C) Clicou na PRÓPRIA conversa (no corpo dela) para abrir
            const historyItem = e.target.closest('.historyItem');
            if (historyItem) {
                const chatId = historyItem.getAttribute('data-id');
                // Só carrega se não for a conversa que já está aberta
                if (chatId && chatId !== conversaAtualId) {
                    carregarConversa(chatId);
                }
            }
        });
    }

    // 5. Fecha o menu dropdown ao clicar fora
    document.addEventListener('click', () => {
        document.querySelectorAll('.chatDropdown.show').forEach(menu => {
            menu.classList.remove('show');
        });
    });

    
}); // Fim do evento DOMContentLoaded

