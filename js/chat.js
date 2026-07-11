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
    // 3. LÓGICA DE ENVIO E LOADING DA IA
    // ==========================================
    
    // Constrói o HTML da nova mensagem e joga na tela
    const appendMessage = (text, isUser = true) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'userMessage' : 'aiMessage'}`;

        if (isUser) {
            // Mantém as quebras de linha digitadas pelo usuário
            messageDiv.innerHTML = `<div class="messageContent">${text.replace(/\n/g, '<br>')}</div>`;
        } else {
            messageDiv.innerHTML = `
                <div class="aiAvatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 10 c0-5 3-7 7-7 5 0 7 2.5 7 6 0 1.5-.5 3-1 4 -1-2-3.5-3-6-3 -2 0-4 1-5 2.5 C5.5 11.5 5 10.5 5 10 Z" />
                        <path d="M6.5 11.5 v2.5 c0 3 2.5 5.5 5.5 5.5 s5.5-2.5 5.5-5.5 v-2.5" />
                        <path d="M9.5 15.5 Q12 14 14.5 15.5" />
                        <line x1="12" y1="16.5" x2="12" y2="19.5" />
                    </svg>
                </div>
                <div class="messageContent">
                    <p>${text}</p>
                </div>
            `;
        }

        messagesArea.appendChild(messageDiv);
        
        // Rola o chat para a mensagem mais recente
        messagesArea.scrollTop = messagesArea.scrollHeight;
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

    const handleSendMessage = () => {
        const text = chatInput.value.trim();
        if (!text) return; // Não envia se estiver vazio

        // 1. Registra a mensagem do usuário
        appendMessage(text, true);

        // 2. Limpa o input, foca nele novamente e reseta o tamanho
        chatInput.value = '';
        chatInput.focus();
        handleInputResize();
        
        // Se estiver expandido e a mensagem for enviada, pode ser legal recolher:
        // Se quiser que fique aberto, só remover o if abaixo.
        if (inputSection.classList.contains('expandedMode')) {
            document.getElementById('expandBtn').click(); 
        }

        // 3. Ativa o "pensamento" da IA
        setAiLoading(true);

        // 4. Simulação de resposta (Timer de 2 segundos)
        setTimeout(() => {
            appendMessage("Esta é uma resposta simulada. Em breve, esta mensagem virá diretamente do seu fluxo no n8n e do Supabase!", false);
            setAiLoading(false);
        }, 2000);
    };

    if (sendBtn && chatInput) {
        // Envio pelo botão azul
        sendBtn.addEventListener('click', handleSendMessage);

        // Envio pela tecla Enter (Shift + Enter pula linha normalmente)
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Evita a quebra de linha nativa
                handleSendMessage();
            }
        });
    }
});