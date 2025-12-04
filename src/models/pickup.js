import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { applyProps } from '../utils/applyMaterial';
import { state } from '../utils/state';

const gltfLoader = new GLTFLoader();
const draco = new DRACOLoader();
draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
gltfLoader.setDRACOLoader(draco);

// Масив назв стандартних коліс PickUp
const wheelsPickUpArr = [
    'UTLTRUCK90_WheelStock_RR_RB1c_Tire_1k_0',
    'UTLTRUCK90_WheelStock_RL_RB1c_Tire_1k_0',
    'UTLTRUCK90_WheelStock_FL_RB1c_Tire_1k_0',
    'UTLTRUCK90_WheelStock_FR_RB1c_Tire_1k_0'
];

// Функція для оновлення видимості стандартних коліс
function updatePickUpWheelsVisibility(model, visible) {
    model.traverse((child) => {
        if (child.isMesh) {
            wheelsPickUpArr.forEach((wheel) => {
                applyProps(child, wheel, {
                    visible: visible
                });
            });
        }
    });
}

export function addPickUp(scene, colorSwitcher, onLoad) {
    state.aWasCalled = true;
    gltfLoader.load('./models/PickUp/PickUpWithoutBagaznic.glb', (glb) => {
        const model = glb.scene;
        model.traverse((child) => {
            if (child.isMesh) {
                //цей код відкриває багажник
                applyProps(child, 'UTLTRUCK90_Truckbed_UTLTRUCK90_Bodymat_0001', {
                    rotation: [0, 0, Math.PI / -2],
                    position: [3, 2.8, 0],
                });
                if (state.activeWheels) {
                    wheelsPickUpArr.forEach((wheel)=>{
                        applyProps(child, wheel, {
                            visible: false
                        })
                    })
                }else{
                    wheelsPickUpArr.forEach((wheel)=>{
                        applyProps(child, wheel, {
                            visible: true
                        })
                    })
                }
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        // Додати функцію для оновлення видимості коліс
        model.updateWheelsVisibility = (visible) => {
            updatePickUpWheelsVisibility(model, visible);
        };
        
         if (colorSwitcher) colorSwitcher.setModel(model);
        scene.add(model);
        if (onLoad) onLoad(model);
    });
}

