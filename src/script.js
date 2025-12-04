import './styles/main.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { createPlane } from './objects/plane.js';
import { createScene } from './init/scene.js';
import { createCamera } from './init/camera.js';
import { createRenderer } from './init/renderer.js';
import { createControls } from './init/controls.js';
import { createLights } from './init/lights.js';
import { animate } from './init/animation.js';
import { createNavbar } from './views/navbar.js';
import { createLeftButtons } from './views/leftButtons.js';
import { createColorSwitcher } from './views/switchColor.js';
import { createAuthModal } from './views/authModal.js';
import { createNavigationArrows } from './views/navigationArrows.js';
import { createModelTitle } from './views/modelTitle.js';
import { createToggleButton } from './views/toggleButton.js';
import { createBackgroundShadow } from './views/backgroundShadow.js';
import { createBrochuresPage } from './views/brochuresPage.js';
import { createFavouritesPage } from './views/favouritesPage.js';
import { createWheelsSwitcher } from './views/wheelsSwitcher.js';
import { createSplashScreen } from './views/splashScreen.js';
import authManager from './managers/authManager.js';
import { state } from './utils/state.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import {
    addPickUp,
    addSprinter,
    addWheelsV1,
    addWheelsV2,
    addTent,
    addLightInSprinter
} from './models/index.js';

// Показати splash screen при завантаженні
// createSplashScreen();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const canvas = document.querySelector('.canvas');

const scene = createScene();
const camera = createCamera(sizes);
scene.add(camera);

const renderer = createRenderer(canvas, sizes);

const controls = createControls(camera, canvas);

const plane = createPlane();
scene.add(plane);

const { directional, ambient } = createLights();
directional.target.position.set(0, 2.5, 0);
scene.add(directional.target);
scene.add(directional, ambient);
//light helper
// const lightHelper = new THREE.DirectionalLightHelper(directional);
// scene.add(lightHelper);
// //axes helper
const axesHelper = new THREE.AxesHelper(2);
axesHelper.position.y = .2;
// scene.add(axesHelper);


const navbar = createNavbar((page) => {
    authModal.show(page);
});
document.body.appendChild(navbar);


const authModal = createAuthModal();
authModal.onAuthSuccess = (user) => {
    authManager.setUser(user);
};
document.body.appendChild(authModal);


const navbarAuthContainer = navbar.querySelector('#navbarAuth');
const navbarUserContainer = navbar.querySelector('#navbarUser');
authManager.init(navbarAuthContainer, navbarUserContainer);

// Змінна для зберігання намету
let tentModel = null;
const container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container)
const leftButtons = createLeftButtons((category) => {
    // Обробка різних категорій
    if (category === 'wheels') {
        // Показати wheelsSwitcher
        wheelsSwitcher.style.display = 'flex';
        
        // Сховати намет
        if (tentModel) {
            scene.remove(tentModel);
        }
    } else if (category === 'camping') {
        // Перевірити чи це PickUp
        if (currentModel !== 'pickup') {
            alert('Camping tent is only available for PickUp model!');
            return;
        }
        
        // Сховати wheelsSwitcher
        wheelsSwitcher.style.display = 'none';
        
        // Показати намет
        if (!tentModel) {
            addTent(scene, (model) => {
                tentModel = model;
            });
        } else {
            scene.add(tentModel);
        }
    } else if (category === null) {
        // Деактивація - сховати все
        wheelsSwitcher.style.display = 'none';
        
        if (tentModel) {
            scene.remove(tentModel);
        }
    } else {
        // Інші категорії - сховати все
        wheelsSwitcher.style.display = 'none';
        
        if (tentModel) {
            scene.remove(tentModel);
        }
    }
});
leftButtons.style.display = 'none';
container.appendChild(leftButtons);


const colorSwitcher = createColorSwitcher(null);
colorSwitcher.style.display = 'none';
container.appendChild(colorSwitcher);

// Перемикач коліс (схований за замовчуванням)
const wheelsSwitcher = createWheelsSwitcher(scene, addWheelsV1, addWheelsV2);
wheelsSwitcher.style.display = 'none';
document.body.appendChild(wheelsSwitcher);

let modelTitleComponent = null;


const bgShadow = createBackgroundShadow();
document.body.appendChild(bgShadow);


const toggleButton = createToggleButton();
document.body.appendChild(toggleButton);


// Стан поточної моделі
let currentModel = 'sprinter'; // 'sprinter' або 'pickup'
let sprinterModel = null;
let pickupModel = null;

// Функція для анімації камери
function animateCameraForModel(modelType) {
    if (modelType === 'pickup') {
        // PickUp більший, камера далі
        gsap.to(camera.position, {
            duration: 1,
            x: 0,
            y: 2.5,
            z: 6,
            ease: 'power2.inOut'
        });
    } else {
        // Sprinter менший, камера ближче
        gsap.to(camera.position, {
            duration: 1,
            x: 0,
            y: 2,
            z: 5,
            ease: 'power2.inOut'
        });
    }
}

const navigationArrows = createNavigationArrows((direction) => {
    if (direction === 'right') {
        // Перемикаємо на PickUp
        if (currentModel === 'sprinter') {
            // Видаляємо Sprinter
            if (sprinterModel) {
                scene.remove(sprinterModel);
            }
            
            // Додаємо PickUp
            if (!pickupModel) {
                addPickUp(scene, colorSwitcher, (model) => {
                    pickupModel = model;
                    // Оновлюємо посилання на моделі в wheelsSwitcher
                    wheelsSwitcher.setModels(sprinterModel, pickupModel);
                });
            } else {
                scene.add(pickupModel);
                // Оновлюємо colorSwitcher для існуючої моделі
                colorSwitcher.setModel(pickupModel);
            }
            
            currentModel = 'pickup';
            
            // Оновлюємо назву моделі
            modelTitle.updateModel('PickUp');
            
            // Анімація камери
            animateCameraForModel('pickup');
            
            // Оновлюємо позиції коліс
            wheelsSwitcher.updateWheelsPositions(true);
            
            // Показати активні колеса
            wheelsSwitcher.showActiveWheels();
            
            // Увімкнути кнопку CAMPING для PickUp
            leftButtons.updateCampingAvailability(true);
            
            console.log('Switched to PickUp');
        }
    } else if (direction === 'left') {
        // Перемикаємо на Sprinter
        if (currentModel === 'pickup') {
            // Видаляємо PickUp
            if (pickupModel) {
                scene.remove(pickupModel);
            }
            
            // Додаємо Sprinter
            if (!sprinterModel) {
                addSprinter(scene, colorSwitcher, (model) => {
                    sprinterModel = model;
                });
            } else {
                scene.add(sprinterModel);
                // Оновлюємо colorSwitcher для існуючої моделі
                colorSwitcher.setModel(sprinterModel);
            }
            
            currentModel = 'sprinter';
            
            // Оновлюємо назву моделі
            modelTitle.updateModel('Sprinter');
            
            // Анімація камери
            animateCameraForModel('sprinter');
            
            // Оновлюємо позиції коліс
            wheelsSwitcher.updateWheelsPositions(false);
            
            // Показати активні колеса
            wheelsSwitcher.showActiveWheels();
            
            // Вимкнути кнопку CAMPING для Sprinter
            leftButtons.updateCampingAvailability(false);
            
            // Сховати намет якщо він був
            if (tentModel) {
                scene.remove(tentModel);
            }
            
            console.log('Switched to Sprinter');
        }
    }
});
document.body.appendChild(navigationArrows);


const modelTitle = createModelTitle('Pickup');
document.body.appendChild(modelTitle);


colorSwitcher.onColorChange((colorName) => {
    modelTitle.updateColor(colorName);
});

// Зв'язати wheelsSwitcher з modelTitle
wheelsSwitcher.onWheelsChange = (wheelsType) => {
    modelTitle.updateWheels(wheelsType);
};


const brochuresPage = createBrochuresPage();
document.body.appendChild(brochuresPage);

const favouritesPage = createFavouritesPage((fav) => {
    console.log('Load favourite:', fav);
    
    // Переключити на правильну модель
    if (fav.name === 'PickUp' && currentModel !== 'pickup') {
        // Видаляємо Sprinter
        if (sprinterModel) {
            scene.remove(sprinterModel);
        }
        
        // Додаємо PickUp
        if (!pickupModel) {
            addPickUp(scene, colorSwitcher, (model) => {
                pickupModel = model;
            });
        } else {
            scene.add(pickupModel);
        }
        
        currentModel = 'pickup';
        modelTitle.updateModel('PickUp');
        
        // Анімація камери
        animateCameraForModel('pickup');
        
        // Увімкнути кнопку CAMPING
        leftButtons.updateCampingAvailability(true);
        
        // Оновлюємо позиції коліс
        wheelsSwitcher.updateWheelsPositions(true);
        
        // Показати активні колеса
        wheelsSwitcher.showActiveWheels();
    } else if (fav.name === 'Sprinter' && currentModel !== 'sprinter') {
        // Видаляємо PickUp
        if (pickupModel) {
            scene.remove(pickupModel);
        }
        
        // Додаємо Sprinter
        if (!sprinterModel) {
            addSprinter(scene, colorSwitcher, (model) => {
                sprinterModel = model;
            });
        } else {
            scene.add(sprinterModel);
        }
        
        currentModel = 'sprinter';
        modelTitle.updateModel('Sprinter');
        
        // Анімація камери
        animateCameraForModel('sprinter');
        
        // Вимкнути кнопку CAMPING
        leftButtons.updateCampingAvailability(false);
        
        // Оновлюємо позиції коліс
        wheelsSwitcher.updateWheelsPositions(false);
        
        // Показати активні колеса
        wheelsSwitcher.showActiveWheels();
    }
    
    // Оновити колір в modelTitle
    modelTitle.updateColor(fav.color);
    
    // Застосувати колір
    const circles = colorSwitcher.querySelectorAll('.color-circle');
    circles.forEach(circle => {
        const colorName = circle.getAttribute('data-name');
        if (colorName === fav.color) {
            circle.click(); 
        }
    });
    
    // Застосувати колеса
    if (fav.wheels) {
        modelTitle.updateWheels(fav.wheels);
        
        const wheelsOptions = wheelsSwitcher.querySelectorAll('.wheels-option');
        wheelsOptions.forEach(option => {
            const wheelsType = option.getAttribute('data-wheels');
            if (wheelsType === fav.wheels) {
                option.click();
            }
        });
    }
    
    console.log('Load model:', fav.name, 'with color:', fav.color, 'wheels:', fav.wheels);
});
document.body.appendChild(favouritesPage);

document.querySelectorAll('.navbar-link').forEach(link => {
    if (link.textContent === 'BROCHURES') {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            brochuresPage.show();
        });
    }
    if (link.textContent === 'FAVOURITES') {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            favouritesPage.show();
        });
    }
});


animate(renderer, scene, camera, controls, [plane]);


window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(sizes.width, sizes.height);
});
window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});
//HDRI Mapp
const loader = new EXRLoader();

loader.load('texture/studio_small_08_1k.exr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    // Використати як фон
    // scene.background = texture;
    
    // Використати як environment map (для відбиттів, PBR матеріалів)
    scene.environmentIntensity = 0.3;
    scene.environment = texture;
});

// Завантажуємо Sprinter за замовчуванням
addSprinter(scene, colorSwitcher, (model) => {
    sprinterModel = model;
    // Оновлюємо посилання на моделі в wheelsSwitcher
    wheelsSwitcher.setModels(sprinterModel, pickupModel);
});
