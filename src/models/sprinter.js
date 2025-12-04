import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { applyProps } from '../utils/applyMaterial.js';
import { state } from '../utils/state.js';

const gltfLoader = new GLTFLoader();
const draco = new DRACOLoader();
draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
gltfLoader.setDRACOLoader(draco);

// Функція для оновлення видимості стандартних коліс
function updateSprinterWheelsVisibility(model, visible) {
    model.traverse((child) => {
        if (child.isMesh) {
            applyProps(child, 'Cylinder_Mat_0', {
                visible: visible
            });
            applyProps(child, 'Cylinder_1_Mat_0', {
                visible: visible
            });
        }
    });
}

export function addSprinter(scene, colorSwitcher, onLoad) {
    state.aWasCalled = false;
    gltfLoader.load('./models/mersedes/SprinterOptimized.glb', (glb) => {
        const model = glb.scene;
        model.position.y = 1.28
        model.rotateY(Math.PI / 2);
        model.traverse((child) => {
            if (child.isMesh) {
                const mat = child.material;
                applyProps(mat, 'Carrosserie', {
                    color: '#fff',
                });
                if(state.activeWheels){
                    applyProps(child, 'Cylinder_Mat_0', {
                        visible: false
                    });
                    applyProps(child, 'Cylinder_1_Mat_0', {
                        visible: false
                    })
                }else{
                    applyProps(child, 'Cylinder_Mat_0', {
                        visible: true
                    });
                    applyProps(child, 'Cylinder_1_Mat_0', {
                        visible: true
                    })
                }
                child.castShadow = true;
                child.receiveShadow = true;
            }
        })
        
        // Додати функцію для оновлення видимості коліс
        model.updateWheelsVisibility = (visible) => {
            updateSprinterWheelsVisibility(model, visible);
        };
        
        scene.add(model);
        if (colorSwitcher) colorSwitcher.setModel(model);
        if (onLoad) onLoad(model);
    })
}