// Cria o container para os controles
const controlPanel = document.createElement('div');
controlPanel.style.position = 'absolute';
controlPanel.style.top = '10px';
controlPanel.style.right = '10px';
controlPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
controlPanel.style.color = 'white';
controlPanel.style.padding = '5px 10px';
controlPanel.style.borderRadius = '5px';
controlPanel.style.display = 'flex';
controlPanel.style.alignItems = 'center';
controlPanel.style.zIndex = '10000';
controlPanel.style.fontSize = '14px';
controlPanel.style.fontFamily = 'Arial, sans-serif';
controlPanel.style.transition = 'opacity 0.3s';

// Estilos para hover e ocultação
controlPanel.style.opacity = '0';
controlPanel.addEventListener('mouseenter', () => {
    controlPanel.style.opacity = '1';
});
controlPanel.addEventListener('mouseleave', () => {
    controlPanel.style.opacity = '0.5';
});

// Cria o botão de diminuir velocidade
const slowDownButton = document.createElement('button');
slowDownButton.innerText = '-';
slowDownButton.style.marginRight = '10px';
slowDownButton.style.backgroundColor = 'transparent';
slowDownButton.style.color = 'white';
slowDownButton.style.border = '1px solid white';
slowDownButton.style.borderRadius = '3px';
slowDownButton.style.cursor = 'pointer';
slowDownButton.style.padding = '2px 6px';
slowDownButton.style.fontSize = '16px';

// Cria o botão de aumentar velocidade
const speedUpButton = document.createElement('button');
speedUpButton.innerText = '+';
speedUpButton.style.marginLeft = '10px';
speedUpButton.style.backgroundColor = 'transparent';
speedUpButton.style.color = 'white';
speedUpButton.style.border = '1px solid white';
speedUpButton.style.borderRadius = '3px';
speedUpButton.style.cursor = 'pointer';
speedUpButton.style.padding = '2px 6px';
speedUpButton.style.fontSize = '16px';

// Cria o display da velocidade atual
const speedDisplay = document.createElement('span');
speedDisplay.innerText = '1.0x';
speedDisplay.style.margin = '0 10px';
speedDisplay.style.fontWeight = 'bold';

// Adiciona os botões e o display ao painel de controle
controlPanel.appendChild(slowDownButton);
controlPanel.appendChild(speedDisplay);
controlPanel.appendChild(speedUpButton);

// Adiciona o painel de controle ao vídeo
const videoContainer = document.querySelector('video').parentElement;
videoContainer.style.position = 'relative';
videoContainer.appendChild(controlPanel);

// Função para atualizar a velocidade do vídeo e o display
const updateSpeed = (newSpeed) => {
    const video = document.querySelector('video');
    if (video) {
        video.playbackRate = newSpeed;
        speedDisplay.innerText = `${newSpeed.toFixed(1)}x`;
    }
};

// Eventos para os botões de controle
slowDownButton.addEventListener('click', () => {
    const video = document.querySelector('video');
    if (video) {
        let newSpeed = video.playbackRate - 0.1;
        newSpeed = newSpeed < 0.1 ? 0.1 : newSpeed;
        updateSpeed(newSpeed);
    }
});

speedUpButton.addEventListener('click', () => {
    const video = document.querySelector('video');
    if (video) {
        let newSpeed = video.playbackRate + 0.1;
        updateSpeed(newSpeed);
    }
});

// Define a posição do painel de controle
const positionControlPanel = () => {
    const video = document.querySelector('video');
    if (video) {
        const rect = video.getBoundingClientRect();
        controlPanel.style.top = `${rect.top + 10}px`;
        controlPanel.style.right = `${window.innerWidth - rect.right + 10}px`;
    }
};

// Atualiza a posição do painel de controle quando a página rola ou redimensiona
window.addEventListener('scroll', positionControlPanel);
window.addEventListener('resize', positionControlPanel);
window.addEventListener('fullscreenchange', positionControlPanel);

// Inicializa a posição do painel de controle e exibe com delay
positionControlPanel();
controlPanel.style.opacity = '0.5';

// Mostrar o painel ao passar o mouse sobre o vídeo
videoContainer.addEventListener('mouseenter', () => {
    controlPanel.style.opacity = '1';
});

videoContainer.addEventListener('mouseleave', () => {
    controlPanel.style.opacity = '0.5';
});
