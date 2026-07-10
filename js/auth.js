// Adicione isso ao seu arquivo js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    const bgVideo = document.getElementById('bgVideo');
    const bgAudio = document.getElementById('bgAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');

    // Verifica se os elementos existem antes de aplicar a lógica
    if (bgVideo && bgAudio && playPauseBtn && volumeSlider) {

        // Define o volume inicial do áudio baseado no valor do slider (ex: 0.3 = 30%)
        bgAudio.volume = volumeSlider.value;

        // Captura os novos elementos de ícone e texto dentro do botão
        const playPauseIcon = document.getElementById('playPauseIcon');
        const playPauseText = document.getElementById('playPauseText');

        // Define os SVGs
        const playSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>`;
        const pauseSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

        // Função para alternar entre play e pause do vídeo
        playPauseBtn.addEventListener('click', () => {
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

        // Atualiza o volume do áudio em tempo real quando o slider for arrastado
        volumeSlider.addEventListener('input', (e) => {
            bgAudio.volume = e.target.value;
        });
    }
});