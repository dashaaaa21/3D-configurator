class FavouritesManager {
    constructor() {
        this.maxFavourites = 5;
    }

    getStorageKey() {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!user || !user.email) return null;
        return `favourites_${user.email}`;
    }

    getFavourites() {
        const key = this.getStorageKey();
        if (!key) return [];
        
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    addFavourite(model) {
        const key = this.getStorageKey();
        if (!key) {
            alert('Please login to add favourites');
            return false;
        }

        const favourites = this.getFavourites();
        
        // Шукаємо чи є вже така комбінація модель+колір+колеса
        const existingIndex = favourites.findIndex(
            f => f.name === model.name && f.color === model.color && f.wheels === model.wheels
        );
        
        if (existingIndex !== -1) {
            // Вже є така комбінація - не додаємо
            return false;
        }
        
        // Перевіряємо ліміт
        if (favourites.length >= this.maxFavourites) {
            alert(`Maximum ${this.maxFavourites} favourites allowed`);
            return false;
        }
        
        // Додаємо нову комбінацію
        favourites.push({
            id: Date.now(),
            name: model.name,
            color: model.color,
            wheels: model.wheels || 'v1',
            timestamp: new Date().toISOString()
        });

        localStorage.setItem(key, JSON.stringify(favourites));
        return true;
    }


    removeFavourite(id) {
        const key = this.getStorageKey();
        if (!key) return false;

        const favourites = this.getFavourites();
        const filtered = favourites.filter(f => f.id !== id);
        
        localStorage.setItem(key, JSON.stringify(filtered));
        return true;
    }


    isFavourite(modelName, color, wheels) {
        const favourites = this.getFavourites();
        return favourites.some(f => f.name === modelName && f.color === color && f.wheels === wheels);
    }


    getFavouriteId(modelName, color, wheels) {
        const favourites = this.getFavourites();
        const fav = favourites.find(f => f.name === modelName && f.color === color && f.wheels === wheels);
        return fav ? fav.id : null;
    }
    
    
    getFavouriteByName(modelName) {
        const favourites = this.getFavourites();
        return favourites.find(f => f.name === modelName);
    }
}

export default new FavouritesManager();
