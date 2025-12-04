export function createNavbar(onAuthClick) {
    const navbar = document.createElement('nav');
    navbar.className = 'navbar';

    navbar.innerHTML = `
        <div class="navbar-container">
            <div class="navbar-logo">
                <img src="./logo2.png" alt="LOGO">
            </div>
            
            <div class="navbar-links">
                <a href="#" class="navbar-link">HOME</a>
                <a href="#" class="navbar-link">SEARCH</a>
                <a href="#" class="navbar-link">FAVOURITES</a>
                <a href="#" class="navbar-link">BROCHURES</a>
            </div>
            
            <div class="navbar-auth" id="navbarAuth">
                <button class="auth-btn" id="loginBtn">LOGIN</button>
                <button class="auth-btn auth-btn-primary" id="registerBtn">REGISTER</button>
            </div>
            
            <div class="navbar-user" id="navbarUser" style="display: none;"></div>
            
            <button class="burger" id="burger">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
        
        <div class="mobile-menu" id="mobile-menu">
            <a href="#" class="mobile-link">HOME</a>
            <a href="#" class="mobile-link">SEARCH</a>
            <a href="#" class="mobile-link">FAVOURITES</a>
            <a href="#" class="mobile-link">BROCHURES</a>
            <button class="mobile-auth-btn" id="mobileLoginBtn">LOGIN</button>
            <button class="mobile-auth-btn mobile-auth-btn-primary" id="mobileRegisterBtn">REGISTER</button>
        </div>
    `;

    const burger = navbar.querySelector('#burger');
    const mobileMenu = navbar.querySelector('#mobile-menu');
    const mobileLinks = navbar.querySelectorAll('.mobile-link');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });


    const loginBtn = navbar.querySelector('#loginBtn');
    const registerBtn = navbar.querySelector('#registerBtn');
    const mobileLoginBtn = navbar.querySelector('#mobileLoginBtn');
    const mobileRegisterBtn = navbar.querySelector('#mobileRegisterBtn');

    loginBtn.addEventListener('click', () => {
        if (onAuthClick) onAuthClick('login');
    });

    registerBtn.addEventListener('click', () => {
        if (onAuthClick) onAuthClick('register');
    });

    mobileLoginBtn.addEventListener('click', () => {
        if (onAuthClick) onAuthClick('login');
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
    });

    mobileRegisterBtn.addEventListener('click', () => {
        if (onAuthClick) onAuthClick('register');
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
    });

    return navbar;
}