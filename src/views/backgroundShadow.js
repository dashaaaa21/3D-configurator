import bgShadowImg from '../assets/bg-shadow.png';

export function createBackgroundShadow() {
    const shadow = document.createElement('div');
    shadow.className = 'bg-shadow';
    
    const img = document.createElement('img');
    img.src = bgShadowImg;
    img.alt = 'Shadow';
    shadow.appendChild(img);
    
    return shadow;
}
