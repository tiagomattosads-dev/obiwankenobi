document.addEventListener('DOMContentLoaded', () => {

// === AUTH GUARD: Verifica se já está logado ===
    const usuarioLogado = localStorage.getItem('obiwan_user');
    
    // Se a chave existir e não for "Visitante" (ou se tiver um token no futuro), manda pro chat
    if (usuarioLogado && usuarioLogado !== "Visitante") {
        window.location.href = 'chat.html';
        return; // Para a execução do resto do script nesta página
    }

    const bgVideo = document.getElementById('bgVideo');
    const bgAudio = document.getElementById('bgAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');

    if (bgVideo && bgAudio && playPauseBtn && volumeSlider) {
        
        // 1. Define o volume inicial
        bgAudio.volume = volumeSlider.value;

        // 2. GATILHO DE ÁUDIO PARA CONTORNAR O BLOQUEIO DO NAVEGADOR
        const iniciarAudio = () => {
            bgAudio.play().then(() => {
                // Se o play der certo, removemos os ouvintes para não rodar nos próximos cliques
                document.removeEventListener('click', iniciarAudio);
                document.removeEventListener('keydown', iniciarAudio);
                document.removeEventListener('touchstart', iniciarAudio);
            }).catch(erro => {
                console.log("Aguardando interação real do usuário para tocar o áudio.", erro);
            });
        };

        // Fica aguardando qualquer clique, toque na tela ou tecla digitada para iniciar a música
        document.addEventListener('click', iniciarAudio);
        document.addEventListener('keydown', iniciarAudio);
        

        // 3. Captura os elementos de ícone e texto do botão de vídeo
        const playPauseIcon = document.getElementById('playPauseIcon');
        const playPauseText = document.getElementById('playPauseText');

        const playSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>`;
        const pauseSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

        // 4. Lógica do botão Play/Pause do Vídeo
        playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita conflito com o clique global do áudio
            if (bgVideo.paused) {
                bgVideo.play();
                playPauseIcon.innerHTML = pauseSVG;
                playPauseText.textContent = 'Pausar';
            } else {
                bgVideo.pause();
                playPauseIcon.innerHTML = playSVG;
                playPauseText.textContent = 'Reproduzir';
            }
        });

        // 5. Lógica do Slider de Volume
        volumeSlider.addEventListener('input', (e) => {
            bgAudio.volume = e.target.value;
        });
    }
});

// 6. LÓGICA DE TRANSIÇÃO LOGIN / CADASTRO
const loginBox = document.getElementById('loginBox');
const registerBox = document.getElementById('registerBox');
const linkRegister = document.getElementById('linkRegister');
const linkLogin = document.getElementById('linkLogin');

if (loginBox && registerBox && linkRegister && linkLogin) {
    
    // Quando clicar em "Cadastre-se"
    linkRegister.addEventListener('click', (e) => {
        e.preventDefault(); // Impede a página de recarregar
        
        // Dispara a animação do login saindo pela esquerda
        loginBox.classList.remove('slideInLeft', 'slideInRight');
        loginBox.classList.add('slideOutLeft');
        
        // Aguarda os exatos 400ms da animação acabar para ocultar um e mostrar o outro
        setTimeout(() => {
            loginBox.classList.add('hidden');
            registerBox.classList.remove('hidden', 'slideOutRight', 'slideOutLeft');
            
            // Dispara a animação do cadastro entrando pela direita
            registerBox.classList.add('slideInRight');
        }, 400);
    });

    // Quando clicar em "Acessar Terminal" (Voltar)
    linkLogin.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Dispara a animação do cadastro saindo pela direita
        registerBox.classList.remove('slideInLeft', 'slideInRight');
        registerBox.classList.add('slideOutRight');
        
        setTimeout(() => {
            registerBox.classList.add('hidden');
            loginBox.classList.remove('hidden', 'slideOutLeft', 'slideOutRight');
            
            // Dispara a animação do login entrando pela esquerda
            loginBox.classList.add('slideInLeft');
        }, 400);
    });
}

// 7. LÓGICA DE SUBMISSÃO E REDIRECIONAMENTO (Conectado ao Supabase)
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const emailInput = document.getElementById('username').value;
        const senhaInput = document.getElementById('password').value;
        const btn = loginForm.querySelector('.btnSolid');
        
        btn.textContent = "Autenticando...";
        btn.disabled = true;

        try {
            const resposta = await API.login(emailInput, senhaInput);

            if (resposta.sucesso) {
                const nomeCadastrado = resposta.dados.user.user_metadata.nome_operativo || "Mestre Jedi";
                const tratamentoCadastrado = resposta.dados.user.user_metadata.tratamento || "M";
                localStorage.setItem('obiwan_user', nomeCadastrado);
                localStorage.setItem('obiwan_tratamento', tratamentoCadastrado);
                
                showToast("Acesso autorizado. Preparando contato com mestre Kenobi...", false);
                
                // Aguarda 1.5s para o usuário ler o aviso antes de redirecionar
                setTimeout(() => {
                    window.location.href = 'chat.html';
                }, 1500);
            } else {
                showToast("Acesso Negado: " + resposta.erro, true);
                btn.textContent = "Acessar";
                btn.disabled = false;
            }
        } catch (err) {
            showToast("Erro de conexão com a base de dados.", true);
            btn.textContent = "Acessar";
            btn.disabled = false;
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nomeInput = document.getElementById('regName').value;
        const tratamentoInput = document.getElementById('regTreatment').value;
        const emailInput = document.getElementById('regEmail').value;
        const senhaInput = document.getElementById('regPassword').value;
        

        // NOVO: Captura o valor do campo de confirmação
        const confirmSenhaInput = document.getElementById('regConfirmPassword').value;
        const btn = registerForm.querySelector('.btnSolid');

        // NOVO: Valida se as senhas são iguais ANTES de bloquear o botão e chamar o banco
        if (senhaInput !== confirmSenhaInput) {
            showToast("Erro: As senhas não coincidem.", true);
            return; // Interrompe a execução aqui
        }

        btn.textContent = "Registrando...";
        btn.disabled = true;
        
        try {
            const resposta = await API.cadastrar(nomeInput, emailInput, senhaInput, tratamentoInput);
            
            if (resposta.sucesso) {
                // 1. Mostra o aviso imersivo
                showToast("Transmissão enviada! Verifique seu e-mail para confirmar as credenciais.", false);
                
                // 2. Limpa os campos do formulário de cadastro
                registerForm.reset();
                
                // 3. Devolve o botão ao estado normal
                btn.textContent = "Cadastrar";
                btn.disabled = false;

                // 4. Aguarda 2.5s para o usuário ler, e joga a tela de volta pro formulário de Login
                setTimeout(() => {
                    document.getElementById('linkLogin').click(); 
                }, 2500);

            } else {
                showToast("Erro ao cadastrar: " + resposta.erro, true);
                btn.textContent = "Cadastrar";
                btn.disabled = false;
            }
        } catch (err) {
            showToast("Erro de conexão com a base de dados.", true);
            btn.textContent = "Cadastrar";
            btn.disabled = false;
        }
    });
}

// Função para disparar o aviso
function showToast(message, isError = true) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    
    toast.className = `toast ${isError ? 'error' : ''}`;
    toast.textContent = `> ${message}`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
} // <--- A FUNÇÃO SHOWTOAST FECHA AQUI!

// ==========================================
// LÓGICA DE MOSTRAR/OCULTAR SENHA
// ==========================================
const togglePasswordBtns = document.querySelectorAll('.togglePassword');

togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Pega o input que está imediatamente antes do botão
        const input = btn.previousElementSibling; 
        
        if (input.type === 'password') {
            input.type = 'text'; // Mostra a senha
            
            // Ícone de Olho Fechado
            btn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            `;
        } else {
            input.type = 'password'; // Oculta a senha
            
            // Ícone de Olho Aberto
            btn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
        }
    });
});

// ==========================================
// LÓGICA DO CUSTOM SELECT (TRATAMENTO)
// ==========================================
const customSelect = document.getElementById('treatmentSelect');

if (customSelect) {
    const trigger = customSelect.querySelector('.customSelectTrigger');
    const options = customSelect.querySelectorAll('.customSelectOptions li');
    const hiddenInput = document.getElementById('regTreatment');
    const triggerText = trigger.querySelector('span');

    // 1. Abrir/Fechar menu ao clicar na barra
    trigger.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que o evento de clique vaze para o 'document'
        customSelect.classList.toggle('open');
    });

    // 2. Quando clicar em uma opção
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Remove a classe "selected" das outras opções
            options.forEach(opt => opt.classList.remove('selected'));
            
            // Marca a opção clicada
            option.classList.add('selected');
            
            // Troca o texto do botão pelo texto escolhido e acende a cor
            triggerText.textContent = option.textContent;
            trigger.classList.add('has-value');
            
            // Joga o valor (M ou F) para o input invisível
            hiddenInput.value = option.getAttribute('data-value');
            
            // Fecha a janela
            customSelect.classList.remove('open');
        });
    });

    // 3. Fechar a lista se o usuário clicar fora dela
    document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            customSelect.classList.remove('open');
        }
    });
}