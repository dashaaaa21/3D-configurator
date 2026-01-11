import videoSrc from '../assets/video.mp4';
export function createSplashScreen() {
    const splash = document.createElement('div');
    splash.className = 'splash-screen';
    splash.innerHTML = `
        <video class="splash-video" autoplay muted playsinline>
            <source src="${videoSrc}" type="video/mp4">
        </video>
    `;
    document.body.appendChild(splash);
    const video = splash.querySelector('.splash-video');
    setTimeout(() => {
        splash.classList.add('fade-out');
        setTimeout(() => {
            splash.remove();
        }, 500);
    }, 4000);
    video.addEventListener('ended', () => {
        if (!splash.classList.contains('fade-out')) {
            splash.classList.add('fade-out');
            setTimeout(() => {
                splash.remove();
            }, 500);
        }
    });
    return splash;
}
