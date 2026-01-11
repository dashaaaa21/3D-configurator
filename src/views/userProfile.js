export function createUserProfile(user, onLogout) {
    const profile = document.createElement('div');
    profile.className = 'user-profile';
    const words = user.name.split(' ');
    let letters = '';
    for (let index = 0; index < words.length; index++) {
        letters = letters + words[index][0];
    }
    const initials = letters.toUpperCase().slice(0, 2);
    profile.innerHTML = `
        <div class="user-avatar" data-action="toggle-dropdown">
            <span class="user-initials">${initials}</span>
        </div>
        <div class="user-dropdown">
            <div class="user-dropdown-header">
                <div class="user-avatar-large">
                    <span class="user-initials-large">${initials}</span>
                </div>
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                </div>
            </div>
            <div class="user-dropdown-menu">
                <a href="#" class="dropdown-item" data-action="favourites">
                    <span>Favourites</span>
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item logout" data-action="logout">
                    <span>Logout</span>
                </a>
            </div>
        </div>
    `;
    setupProfileHandlers(profile, onLogout);
    return profile;
}
function setupProfileHandlers(profile, onLogout) {
    const avatar = profile.querySelector('[data-action="toggle-dropdown"]');
    const dropdown = profile.querySelector('.user-dropdown');
    const logoutBtn = profile.querySelector('[data-action="logout"]');
    const favouritesBtn = profile.querySelector('[data-action="favourites"]');
    avatar.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
        if (!profile.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.remove('active');
        if (onLogout) onLogout();
    });
    favouritesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.remove('active');
    });
}
