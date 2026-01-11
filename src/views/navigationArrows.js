import leftArrowImg from '../assets/left-arrow.png';
import rightArrowImg from '../assets/right-arrow.png';
export function createNavigationArrows(onNavigate) {
    const container = document.createElement('div');
    container.className = 'navigation-arrows';
    container.innerHTML = `
        <button class="arrow-btn arrow-left" id="arrowLeft">
            <img src="${leftArrowImg}" alt="Previous">
        </button>
        <button class="arrow-btn arrow-right" id="arrowRight">
            <img src="${rightArrowImg}" alt="Next">
        </button>
    `;
    const leftBtn = container.querySelector('#arrowLeft');
    const rightBtn = container.querySelector('#arrowRight');
    leftBtn.addEventListener('click', () => {
        if (onNavigate) {
            onNavigate('left');
        }
    });
    rightBtn.addEventListener('click', () => {
        if (onNavigate) {
            onNavigate('right');
        }
    });
    return container;
}
