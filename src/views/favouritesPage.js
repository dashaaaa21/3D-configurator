import favouritesManager from '../managers/favouritesManager.js';
import favouritesIcon from '../assets/favourites.png';

export function createFavouritesPage(onSelectFavourite) {
    const page = document.createElement('div');
    page.className = 'favourites-page';
    page.style.display = 'none';
    
    function render() {
        // Перевірити чи користувач залогінений
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        
        if (!user) {
            page.innerHTML = `
                <div class="favourites-container">
                    <button class="close-favourites-btn" id="closeFav">✕</button>
                    <h1>My Favourites</h1>
                    <p class="no-fav">Please login to view favourites</p>
                </div>
            `;
            page.querySelector('#closeFav').onclick = () => page.style.display = 'none';
            return;
        }
        
        const favourites = favouritesManager.getFavourites();
        
        page.innerHTML = `
            <div class="favourites-container">
                <button class="close-favourites-btn" id="closeFav">✕</button>
                <h1>My Favourites</h1>
                
                <div class="favourites-list">
                    ${favourites.length === 0 ? 
                        '<p class="no-fav">No favourites yet. Add up to 5!</p>' :
                        favourites.map((fav, i) => `
                            <div class="fav-item">
                                <div class="fav-info" data-id="${fav.id}">
                                    <span class="fav-title">${fav.name} - ${fav.color} - ${fav.wheels}</span>
                                </div>
                                <button class="remove-fav-btn" data-id="${fav.id}">
                                    <img src="${favouritesIcon}" alt="Remove">
                                </button>
                            </div>
                        `).join('')
                    }
                </div>
                
                <p class="fav-count">${favourites.length} / 5</p>
            </div>
        `;
        
        page.querySelector('#closeFav').onclick = () => page.style.display = 'none';
        
        // Вибрати улюблене
        page.querySelectorAll('.fav-info').forEach(item => {
            item.onclick = () => {
                const id = parseInt(item.dataset.id);
                const fav = favourites.find(f => f.id === id);
                if (fav && onSelectFavourite) {
                    onSelectFavourite(fav);
                    page.style.display = 'none';
                }
            };
        });
        
        // Видалити улюблене
        page.querySelectorAll('.remove-fav-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                favouritesManager.removeFavourite(id);
                render();
            };
        });
    }
    
    page.show = () => {
        render();
        page.style.display = 'flex';
    };
    
    return page;
}
