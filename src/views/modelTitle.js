import favouritesIcon from '../assets/favourites.png';
import favouritesManager from '../managers/favouritesManager.js';
import { state } from '../utils/state';
import authManager from '../managers/authManager.js';
let modelName;
let currentColor = 'yellow';
let currentWheels = 'v1';
export function createModelTitle() {
    if (state.aWasCalled) {
        modelName = 'PickUp';
    } else {
        modelName = 'Sprinter';
    }
    const container = document.createElement('div');
    container.className = 'model-title-container';
    container.innerHTML = `
        <h2 class="model-title">${modelName}</h2>
        <button class="favourite-btn" id="favouriteBtn">
            <img src="${favouritesIcon}" alt="Add to favourites">
        </button>
    `;
    const favouriteBtn = container.querySelector('#favouriteBtn');
    function updateButton() {
        const isFav = favouritesManager.isFavourite(modelName, currentColor, currentWheels);
        favouriteBtn.classList.toggle('active', isFav);
    }
    updateButton();
    favouriteBtn.addEventListener('click', () => {
        if (!authManager.getUser()) {
            alert('Please log in to add favourites!');
            return;
        }
        const isFav = favouritesManager.isFavourite(modelName, currentColor, currentWheels);
        if (isFav) {
            const id = favouritesManager.getFavouriteId(modelName, currentColor, currentWheels);
            favouritesManager.removeFavourite(id);
            alert('Removed from favourites!');
        } else {
            const added = favouritesManager.addFavourite({
                name: modelName,
                color: currentColor,
                wheels: currentWheels
            });
            if (added) {
                alert('Added to favourites!');
            }
        }
        updateButton();
    });
    container.updateColor = (newColor) => {
        currentColor = newColor;
        updateButton();
    };
    container.updateWheels = (newWheels) => {
        currentWheels = newWheels;
        updateButton();
    };
    container.updateModel = (newModelName) => {
        modelName = newModelName;
        const titleElement = container.querySelector('.model-title');
        if (titleElement) {
            titleElement.textContent = newModelName;
        }
        updateButton();
    };
    return container;
}
