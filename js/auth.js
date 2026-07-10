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