import favouritesManager from '../managers/favouritesManager.js';
export function createFavouritesPage(onSelectFavourite) {
    const page = document.createElement('div');
    page.className = 'favourites-page';
    page.style.display = 'none';
    function render() {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!user) {
            page.innerHTML = `
                <div class="favourites-container">
                    <button class="close-favourites-btn" id="closeFav">X</button>
                    <h1>My Favourites</h1>
                    <div class="no-fav-container">
                        <svg class="no-fav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <p class="no-fav-text">Please login to view favourites</p>
                    </div>
                </div>
            `;
            page.querySelector('#closeFav').onclick = () => page.style.display = 'none';
            return;
        }
        const favourites = favouritesManager.getFavourites();
        page.innerHTML = `
            <div class="favourites-container">
                <button class="close-favourites-btn" id="closeFav">X</button>
                <div class="favourites-header">
                    <h1>My Favourites</h1>
                    <p class="fav-count">${favourites.length} / 5 configurations saved</p>
                </div>
                <div class="favourites-grid">
                    ${favourites.length === 0 ? 
                        `<div class="no-fav-container">
                            <svg class="no-fav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            <p class="no-fav-text">No favourites yet</p>
                            <p class="no-fav-subtext">Configure your dream vehicle and save it here!</p>
                        </div>` :
                        favourites.map((fav, i) => {
                            const date = new Date(fav.timestamp);
                            const formattedDate = date.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                            });
                            return `
                            <div class="fav-card" data-id="${fav.id}">
                                <div class="fav-card-header">
                                    <div class="fav-card-badge">${fav.name}</div>
                                    <button class="remove-fav-btn" data-id="${fav.id}" title="Remove">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                </div>
                                <div class="fav-card-body">
                                    <div class="fav-detail">
                                        <svg class="fav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <circle cx="12" cy="12" r="10"/>
                                        </svg>
                                        <span>Color: <strong>${fav.color}</strong></span>
                                    </div>
                                    <div class="fav-detail">
                                        <svg class="fav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <circle cx="12" cy="12" r="10"/>
                                            <path d="M12 6v6l4 2"/>
                                        </svg>
                                        <span>Wheels: <strong>${fav.wheels || 'Standard'}</strong></span>
                                    </div>
                                    <div class="fav-detail fav-date">
                                        <svg class="fav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6"/>
                                            <line x1="8" y1="2" x2="8" y2="6"/>
                                            <line x1="3" y1="10" x2="21" y2="10"/>
                                        </svg>
                                        <span>${formattedDate}</span>
                                    </div>
                                </div>
                                <button class="fav-load-btn" data-id="${fav.id}">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                    Load Configuration
                                </button>
                            </div>
                        `}).join('')
                    }
                </div>
            </div>
        `;
        page.querySelector('#closeFav').onclick = () => page.style.display = 'none';
        page.querySelectorAll('.fav-load-btn').forEach(btn => {
            btn.onclick = () => {
                const id = parseInt(btn.dataset.id);
                const fav = favourites.find(f => f.id === id);
                if (fav && onSelectFavourite) {
                    onSelectFavourite(fav);
                    page.style.display = 'none';
                }
            };
        });
        page.querySelectorAll('.fav-card').forEach(card => {
            card.onclick = (e) => {
                if (e.target.closest('.remove-fav-btn')) return;
                const id = parseInt(card.dataset.id);
                const fav = favourites.find(f => f.id === id);
                if (fav && onSelectFavourite) {
                    onSelectFavourite(fav);
                    page.style.display = 'none';
                }
            };
        });
        page.querySelectorAll('.remove-fav-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                if (confirm('Are you sure you want to remove this configuration?')) {
                    favouritesManager.removeFavourite(id);
                    render();
                }
            };
        });
    }
    page.show = () => {
        render();
        page.style.display = 'flex';
    };
    return page;
}
