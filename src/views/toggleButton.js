import arrowStartImg from '../assets/arrow-start.png';
import arrowImg from '../assets/arrow.png';
export function createToggleButton() {
    const button = document.createElement('button');
    button.className = 'toggle-btn';
    button.id = 'toggleBtn';
    const img = document.createElement('img');
    img.src = arrowStartImg;
    img.alt = 'Toggle';
    button.appendChild(img);
    let isOpen = false;
    button.addEventListener('click', () => {
        isOpen = !isOpen;
        img.src = isOpen ? arrowImg : arrowStartImg;
        const leftPanel = document.querySelector('.left-panel');
        const colorSwitcher = document.querySelector('.color-switcher');
        if (leftPanel) {
            leftPanel.style.display = isOpen ? 'flex' : 'none';
        }
        if (colorSwitcher) {
            colorSwitcher.style.display = isOpen ? 'flex' : 'none';
        }
    });
    return button;
}
