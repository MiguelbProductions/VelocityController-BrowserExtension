const addFontAwesome = () => {
    const faLink = document.createElement('link');
    faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
    faLink.rel = "stylesheet";
    document.head.appendChild(faLink);
};

addFontAwesome();

function createVideoControlPanel(video) {
    const controlPanel = document.createElement('div');
    controlPanel.className = 'video-control-panel';

    const createButton = (icon, tooltipText, onClick) => {
        const button = document.createElement('button');
        button.innerHTML = icon;
        button.className = 'video-control-button';
        button.title = tooltipText;
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            onClick();
        });
        return button;
    };

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

    const rewindButton = createButton('«', 'Rewind 10 seconds', rewind);
    const slowDownButton = createButton('−', 'Decrease Speed', decreaseSpeed);
    const speedDisplay = document.createElement('span');
    speedDisplay.className = 'video-speed-display';
    speedDisplay.innerText = '1.0×';
    const speedUpButton = createButton('＋', 'Increase Speed', increaseSpeed);
    const forwardButton = createButton('»', 'Forward 10 seconds', forward);
    const resetButton = createButton('↻', 'Reset Speed', resetSpeed);

    controlPanel.appendChild(rewindButton);
    controlPanel.appendChild(slowDownButton);
    controlPanel.appendChild(speedDisplay);
    controlPanel.appendChild(speedUpButton);
    controlPanel.appendChild(forwardButton);
    controlPanel.appendChild(resetButton);

    const videoContainer = video.parentElement;
    videoContainer.style.position = 'relative';
    controlPanel.style.position = 'absolute';
    controlPanel.style.top = '10px';
    controlPanel.style.left = '10px';
    videoContainer.appendChild(controlPanel);

    const updateSpeedDisplay = () => {
        speedDisplay.innerText = `${video.playbackRate.toFixed(1)}×`;
    };

    const savePreferredSpeed = () => {
        localStorage.setItem('videoPreferredSpeed', video.playbackRate);
    };

    const loadPreferredSpeed = () => {
        const savedSpeed = localStorage.getItem('videoPreferredSpeed');
        if (savedSpeed) {
            video.playbackRate = parseFloat(savedSpeed);
            updateSpeedDisplay();
        }
    };

    loadPreferredSpeed();

    videoContainer.addEventListener('mouseenter', () => {
        controlPanel.style.opacity = '1';
    });

    videoContainer.addEventListener('mouseleave', () => {
        controlPanel.style.opacity = '0.5';
    });

    window.addEventListener('resize', () => {
        controlPanel.style.position = document.fullscreenElement ? 'fixed' : 'absolute';
    });

    window.addEventListener('fullscreenchange', () => {
        controlPanel.style.position = document.fullscreenElement ? 'fixed' : 'absolute';
    });

    window.addEventListener('keydown', (event) => {
        if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') return;
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

function createYouTubeControlPanel(video) {
    const controlPanel = document.createElement('div');
    controlPanel.className = 'yt-video-control-panel';

    // Função para criar um botão com ícone e funcionalidade
    const createIconButton = (iconClass, tooltipText, onClick) => {
        const button = document.createElement('button');
        button.innerHTML = `<i class="${iconClass}"></i>`;
        button.className = 'yt-video-icon-button';
        button.title = tooltipText;
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            onClick();
        });
        return button;
    };

    // Botão de controle de velocidade com scroll
    const speedButton = document.createElement('div');
    speedButton.className = 'yt-video-speed-button';
    speedButton.innerHTML = `<i class="fas fa-tachometer-alt"></i> <span class="yt-video-speed-value">${video.playbackRate.toFixed(2)}x</span>`;
    speedButton.title = `Velocidade: ${video.playbackRate}x`;

    const speedValueSpan = speedButton.querySelector('.yt-video-speed-value');
    speedValueSpan.style.display = 'none'; // Esconde o valor da velocidade inicialmente

    const updateSpeedTooltip = () => {
        speedValueSpan.textContent = `${video.playbackRate.toFixed(2)}x`;
        speedButton.title = `Velocidade: ${video.playbackRate.toFixed(2)}x`;
    };

    const adjustSpeed = (delta) => {
        video.playbackRate = Math.max(0.1, Math.min(video.playbackRate + delta, 16));
        updateSpeedTooltip();
    };

    speedButton.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        adjustSpeed(delta);
    });

    speedButton.addEventListener('mouseenter', () => {
        speedValueSpan.style.display = 'inline-block';
        requestAnimationFrame(() => {
            speedValueSpan.style.transform = 'scale(1)';
            speedValueSpan.style.opacity = '1';
        });
    });

    speedButton.addEventListener('mouseleave', () => {
        speedValueSpan.style.transform = 'scale(0)';
        speedValueSpan.style.opacity = '0';
        setTimeout(() => {
            speedValueSpan.style.display = 'none';
        }, 300);
    });

    // Botão de modo de tela cheia
    const fullScreenButton = createIconButton('fas fa-expand', 'Tela cheia', () => {
        if (!document.fullscreenElement) {
            video.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    // Botão de captura de tela
    const screenshotButton = createIconButton('fas fa-camera', 'Capturar tela', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'screenshot.png';
        link.click();
    });

    // Botão de amplificação de som
    let isBoosted = false;
    let audioContext;
    let gainNode;

    const boostVolumeButton = createIconButton('fas fa-volume-down', 'Impulsionar Som', () => {
        if (!isBoosted) {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const source = audioContext.createMediaElementSource(video);
                gainNode = audioContext.createGain();
                gainNode.gain.value = 8; // Multiplica o volume por 8
                source.connect(gainNode).connect(audioContext.destination);
            }
            gainNode.gain.value = 8; // Reativar o ganho
            boostVolumeButton.innerHTML = `<i class="fas fa-volume-up"></i>`; // Ícone de volume alto
            boostVolumeButton.title = 'Desativar Impulso de Som';
            isBoosted = true;
        } else {
            gainNode.gain.value = 1; // Desativar o ganho
            boostVolumeButton.innerHTML = `<i class="fas fa-volume-down"></i>`; // Ícone de volume normal
            boostVolumeButton.title = 'Impulsionar Som';
            isBoosted = false;
        }
    });

    controlPanel.appendChild(speedButton);
    controlPanel.appendChild(fullScreenButton);
    controlPanel.appendChild(screenshotButton);
    controlPanel.appendChild(boostVolumeButton);

    const insertPanel = () => {
        const metadataContainer = document.querySelector('#above-the-fold');
        if (metadataContainer) {
            metadataContainer.insertAdjacentElement('afterbegin', controlPanel);
        }
    };

    const observer = new MutationObserver(() => {
        const metadataContainer = document.querySelector('#above-the-fold');
        if (metadataContainer) {
            observer.disconnect();
            insertPanel();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    updateSpeedTooltip();
}

// Inicializar o painel de controle baseado no site
const video = document.querySelector('video');
if (video) {
    if (window.location.hostname.includes('youtube.com')) {
        createYouTubeControlPanel(video);
    } else {
        createVideoControlPanel(video);  // Adapte para sites genéricos conforme necessário
    }
}