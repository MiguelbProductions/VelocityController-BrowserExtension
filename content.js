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
controlPanel.style.transition = 'opacity 0.3s, top 0.3s, right 0.3s';
controlPanel.style.opacity = '0.5';

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

// Cria o botão de redefinir velocidade
const resetButton = document.createElement('button');
resetButton.innerText = 'Reset';
resetButton.style.marginLeft = '10px';
resetButton.style.backgroundColor = 'transparent';
resetButton.style.color = 'white';
resetButton.style.border = '1px solid white';
resetButton.style.borderRadius = '3px';
resetButton.style.cursor = 'pointer';
resetButton.style.padding = '2px 6px';
resetButton.style.fontSize = '16px';

// Cria o display da velocidade atual
const speedDisplay = document.createElement('span');
speedDisplay.innerText = '1.0x';
speedDisplay.style.margin = '0 10px';
speedDisplay.style.fontWeight = 'bold';

// Adiciona os botões e o display ao painel de controle
controlPanel.appendChild(slowDownButton);
controlPanel.appendChild(speedDisplay);
controlPanel.appendChild(speedUpButton);
controlPanel.appendChild(resetButton);

// Adiciona o painel de controle ao vídeo
const video = document.querySelector('video');
const videoContainer = video.parentElement;
videoContainer.style.position = 'relative';
videoContainer.appendChild(controlPanel);

// Função para atualizar a velocidade do vídeo e o display
const updateSpeed = (newSpeed) => {
    if (video) {
        video.playbackRate = newSpeed;
        speedDisplay.innerText = `${newSpeed.toFixed(1)}x`;
        localStorage.setItem('preferredSpeed', newSpeed); // Salva a velocidade no armazenamento local
    }
};

// Eventos para os botões de controle
slowDownButton.addEventListener('click', () => {
    let newSpeed = video.playbackRate - 0.1;
    newSpeed = newSpeed < 0.1 ? 0.1 : newSpeed;
    updateSpeed(newSpeed);
});

speedUpButton.addEventListener('click', () => {
    let newSpeed = video.playbackRate + 0.1;
    updateSpeed(newSpeed);
});

resetButton.addEventListener('click', () => {
    updateSpeed(1.0);
});

// Função para reposicionar o painel de controle
const positionControlPanel = () => {
    if (document.fullscreenElement) {
        // Em modo fullscreen
        controlPanel.style.position = 'fixed';
        controlPanel.style.top = '10px';
        controlPanel.style.right = '10px';
    } else {
        // Não em modo fullscreen
        controlPanel.style.position = 'absolute';
        controlPanel.style.top = '10px';
        controlPanel.style.right = '10px';
    }
};

// Carrega a velocidade preferida
const preferredSpeed = localStorage.getItem('preferredSpeed');
if (preferredSpeed) {
    updateSpeed(parseFloat(preferredSpeed));
}

// Atualiza a posição do painel de controle quando a página rola, redimensiona ou entra/sai de fullscreen
window.addEventListener('scroll', positionControlPanel);
window.addEventListener('resize', positionControlPanel);
window.addEventListener('fullscreenchange', positionControlPanel);

// Inicializa a posição do painel de controle
positionControlPanel();

// Mostrar o painel ao passar o mouse sobre o vídeo
videoContainer.addEventListener('mouseenter', () => {
    controlPanel.style.opacity = '1';
});

videoContainer.addEventListener('mouseleave', () => {
    controlPanel.style.opacity = '0.5';
});

// Atalhos de teclado para controlar a velocidade
window.addEventListener('keydown', (event) => {
    if (event.key === '=') {
        speedUpButton.click(); // Aumenta a velocidade com '='
    } else if (event.key === '-') {
        slowDownButton.click(); // Diminui a velocidade com '-'
    } else if (event.key === '0') {
        resetButton.click(); // Reseta a velocidade com '0'
    }
});
