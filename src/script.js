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
import { createRoofSwitcher } from './views/roofSwitcher.js';
import authManager from './managers/authManager.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import {
    addPickUp,
    addSprinter,
    addWheelsV1,
    addWheelsV2,
    addTent,
    addRoofRack
} from './models/index.js';
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
const axesHelper = new THREE.AxesHelper(2);
axesHelper.position.y = .2;
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
let tentModel = null;
const container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);
const leftButtons = createLeftButtons((category) => {
    if (category === 'wheels') {
        wheelsSwitcher.style.display = 'flex';
        roofSwitcher.style.display = 'none';
        if (tentModel) {
            scene.remove(tentModel);
        }
    } else if (category === 'roof') {
        if (currentModel === 'sprinter') {
            roofSwitcher.style.display = 'flex';
        }
        wheelsSwitcher.style.display = 'none';
        if (tentModel) {
            scene.remove(tentModel);
        }
    } else if (category === 'rear') {
        if (currentModel === 'sprinter') {
            roofSwitcher.style.display = 'flex';
        }
        wheelsSwitcher.style.display = 'none';
        if (tentModel) {
            scene.remove(tentModel);
        }
    } else if (category === 'camping') {
        if (currentModel !== 'pickup') {
            alert('Camping tent is only available for PickUp model!');
            return;
        }
        wheelsSwitcher.style.display = 'none';
        roofSwitcher.style.display = 'none';
        if (!tentModel) {
            addTent(scene, (model) => {
                tentModel = model;
            });
        } else {
            scene.add(tentModel);
        }
    } else {
        wheelsSwitcher.style.display = 'none';
        roofSwitcher.style.display = 'none';
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
const wheelsSwitcher = createWheelsSwitcher(scene, addWheelsV1, addWheelsV2);
wheelsSwitcher.style.display = 'none';
document.body.appendChild(wheelsSwitcher);
const roofSwitcher = createRoofSwitcher(scene, addRoofRack);
roofSwitcher.style.display = 'none';
document.body.appendChild(roofSwitcher);
const bgShadow = createBackgroundShadow();
document.body.appendChild(bgShadow);
const toggleButton = createToggleButton();
document.body.appendChild(toggleButton);
let currentModel = 'sprinter';
let sprinterModel = null;
let pickupModel = null;
function animateCameraForModel(modelType) {
    if (modelType === 'pickup') {
        gsap.to(camera.position, {
            duration: 1,
            x: 0,
            y: 2.5,
            z: 6,
            ease: 'power2.inOut'
        });
    } else {
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
        if (currentModel === 'sprinter') {
            if (sprinterModel) {
                scene.remove(sprinterModel);
            }
            if (!pickupModel) {
                addPickUp(scene, colorSwitcher, (model) => {
                    pickupModel = model;
                    wheelsSwitcher.setModels(sprinterModel, pickupModel);
                });
            } else {
                scene.add(pickupModel);
                colorSwitcher.setModel(pickupModel);
            }
            currentModel = 'pickup';
            modelTitle.updateModel('PickUp');
            animateCameraForModel('pickup');
            wheelsSwitcher.updateWheelsPositions(true);
            wheelsSwitcher.resetToDefaultWheels('pickup');
            leftButtons.updateAvailableButtons('pickup');
            roofSwitcher.clearRoof();
            roofSwitcher.style.display = 'none';
        }
    } else if (direction === 'left') {
        if (currentModel === 'pickup') {
            if (pickupModel) {
                scene.remove(pickupModel);
            }
            if (!sprinterModel) {
                addSprinter(scene, colorSwitcher, (model) => {
                    sprinterModel = model;
                    roofSwitcher.setSprinterModel(model);
                });
            } else {
                scene.add(sprinterModel);
                colorSwitcher.setModel(sprinterModel);
                roofSwitcher.setSprinterModel(sprinterModel);
            }
            currentModel = 'sprinter';
            modelTitle.updateModel('Sprinter');
            animateCameraForModel('sprinter');
            wheelsSwitcher.updateWheelsPositions(false);
            wheelsSwitcher.resetToDefaultWheels('sprinter');
            leftButtons.updateAvailableButtons('sprinter');
            if (tentModel) {
                scene.remove(tentModel);
            }
        }
    }
});
document.body.appendChild(navigationArrows);
const modelTitle = createModelTitle('Pickup');
document.body.appendChild(modelTitle);
colorSwitcher.onColorChange((colorName) => {
    modelTitle.updateColor(colorName);
});
wheelsSwitcher.onWheelsChange = (wheelsType) => {
    modelTitle.updateWheels(wheelsType);
};
const brochuresPage = createBrochuresPage();
document.body.appendChild(brochuresPage);
const favouritesPage = createFavouritesPage((fav) => {
    if (fav.name === 'PickUp' && currentModel !== 'pickup') {
        if (sprinterModel) {
            scene.remove(sprinterModel);
        }
        if (!pickupModel) {
            addPickUp(scene, colorSwitcher, (model) => {
                pickupModel = model;
            });
        } else {
            scene.add(pickupModel);
        }
        currentModel = 'pickup';
        modelTitle.updateModel('PickUp');
        animateCameraForModel('pickup');
        leftButtons.updateAvailableButtons('pickup');
        wheelsSwitcher.updateWheelsPositions(true);
        wheelsSwitcher.showActiveWheels();
    } else if (fav.name === 'Sprinter' && currentModel !== 'sprinter') {
        if (pickupModel) {
            scene.remove(pickupModel);
        }
        if (!sprinterModel) {
            addSprinter(scene, colorSwitcher, (model) => {
                sprinterModel = model;
                roofSwitcher.setSprinterModel(model);
            });
        } else {
            scene.add(sprinterModel);
            roofSwitcher.setSprinterModel(sprinterModel);
        }
        currentModel = 'sprinter';
        modelTitle.updateModel('Sprinter');
        animateCameraForModel('sprinter');
        leftButtons.updateAvailableButtons('sprinter');
        wheelsSwitcher.updateWheelsPositions(false);
        wheelsSwitcher.showActiveWheels();
    }
    modelTitle.updateColor(fav.color);
    const circles = colorSwitcher.querySelectorAll('.color-circle');
    circles.forEach(circle => {
        const colorName = circle.getAttribute('data-name');
        if (colorName === fav.color) {
            circle.click(); 
        }
    });
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
const loader = new EXRLoader();
loader.load('texture/studio_small_08_1k.exr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environmentIntensity = 0.3;
    scene.environment = texture;
});
addSprinter(scene, colorSwitcher, (model) => {
    sprinterModel = model;
    wheelsSwitcher.setModels(sprinterModel, pickupModel);
    roofSwitcher.setSprinterModel(sprinterModel);
});
