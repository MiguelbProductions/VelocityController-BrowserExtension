// Seleciona o elemento de vídeo na página
const video = document.querySelector('video');

// Verifica se o vídeo existe na página
if (video) {
    // Cria o container para os controles
    const controlPanel = document.createElement('div');
    controlPanel.className = 'video-control-panel';

    // Função para criar um botão com tooltip
    const createButton = (icon, tooltipText, onClick) => {
        const button = document.createElement('button');
        button.innerHTML = icon;
        button.className = 'video-control-button';
        button.title = tooltipText;
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita clicar no vídeo
            onClick();
        });
        return button;
    };

    // Funções de controle
    const rewind = () => { video.currentTime = Math.max(0, video.currentTime - 10); };
    const forward = () => { video.currentTime = Math.min(video.duration, video.currentTime + 10); };
    const decreaseSpeed = () => {
        video.playbackRate = Math.max(0.1, video.playbackRate - 0.1);
        updateSpeedDisplay();
        savePreferredSpeed();
    };
    const increaseSpeed = () => {
        video.playbackRate = Math.min(16, video.playbackRate + 0.1);
        updateSpeedDisplay();
        savePreferredSpeed();
    };
    const resetSpeed = () => {
        video.playbackRate = 1.0;
        updateSpeedDisplay();
        savePreferredSpeed();
    };

    // Cria os botões com ícones e tooltips
    const rewindButton = createButton('«', 'Retroceder 10 segundos (Tecla: ←)', rewind);
    const slowDownButton = createButton('−', 'Diminuir velocidade (Tecla: −)', decreaseSpeed);
    
    const speedDisplay = document.createElement('span');
    speedDisplay.className = 'video-speed-display';
    speedDisplay.innerText = '1.0×';
    
    const speedUpButton = createButton('＋', 'Aumentar velocidade (Tecla: =)', increaseSpeed);
    const forwardButton = createButton('»', 'Avançar 10 segundos (Tecla: →)', forward);
    const resetButton = createButton('↻', 'Resetar velocidade (Tecla: 0)', resetSpeed);

    // Adiciona os botões ao painel de controle
    controlPanel.appendChild(rewindButton);
    controlPanel.appendChild(slowDownButton);
    controlPanel.appendChild(speedDisplay);
    controlPanel.appendChild(speedUpButton);
    controlPanel.appendChild(forwardButton);
    controlPanel.appendChild(resetButton);

    // Adiciona o painel de controle ao contêiner do vídeo
    const videoContainer = video.parentElement;
    videoContainer.style.position = 'relative';
    controlPanel.style.position = 'absolute'; // Posiciona em relação ao contêiner do vídeo
    controlPanel.style.top = '10px';
    controlPanel.style.left = '10px';
    videoContainer.appendChild(controlPanel);

    // Atualiza o display de velocidade
    const updateSpeedDisplay = () => {
        speedDisplay.innerText = `${video.playbackRate.toFixed(1)}×`;
    };

    // Salva a velocidade preferida no localStorage
    const savePreferredSpeed = () => {
        localStorage.setItem('videoPreferredSpeed', video.playbackRate);
    };

    // Carrega a velocidade preferida do localStorage
    const loadPreferredSpeed = () => {
        const savedSpeed = localStorage.getItem('videoPreferredSpeed');
        if (savedSpeed) {
            video.playbackRate = parseFloat(savedSpeed);
            updateSpeedDisplay();
        }
    };

    loadPreferredSpeed();

    // Reposiciona o painel de controle em eventos relevantes
    const positionControlPanel = () => {
        if (document.fullscreenElement) {
            controlPanel.style.position = 'fixed';
            controlPanel.style.top = '10px';
            controlPanel.style.left = '10px';
        } else {
            controlPanel.style.position = 'absolute';
            controlPanel.style.top = '10px';
            controlPanel.style.left = '10px';
        }
    };

    positionControlPanel();

    // Mostrar o painel ao passar o mouse sobre o vídeo
    videoContainer.addEventListener('mouseenter', () => {
        controlPanel.style.opacity = '1';
    });

    videoContainer.addEventListener('mouseleave', () => {
        controlPanel.style.opacity = '0.5';
    });

    // Atualiza a posição do painel em eventos relevantes
    window.addEventListener('resize', positionControlPanel);
    window.addEventListener('scroll', positionControlPanel);
    window.addEventListener('fullscreenchange', positionControlPanel);

    // Atalhos de teclado
    window.addEventListener('keydown', (event) => {
        if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') {
            return; // Evita conflitos quando digitando em inputs
        }
        switch (event.key) {
            case '=':
            case '+':
                increaseSpeed();
                break;
            case '-':
            case '_':
                decreaseSpeed();
                break;
            case '0':
                resetSpeed();
                break;
            case 'ArrowLeft':
                rewind();
                break;
            case 'ArrowRight':
                forward();
                break;
            default:
                break;
        }
    });
}
