document.addEventListener('DOMContentLoaded', () => {
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
        document.addEventListener('touchstart', iniciarAudio);

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

// 7. LÓGICA DE SUBMISSÃO E REDIRECIONAMENTO
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        // Evita o recarregamento padrão da página ao enviar o formulário
        e.preventDefault(); 
        
        // Futuramente, a conexão com o Supabase entrará exatamente aqui.
        // Por enquanto, vamos direto para a página do chat:
        window.location.href = 'chat.html';
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simula o redirecionamento após um cadastro bem-sucedido
        window.location.href = 'chat.html';
    });
}