import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { state } from '../utils/state';
const gltfLoader = new GLTFLoader();
let positions;

// Функція для отримання позицій коліс v1
function getWheelsV1Positions(isPickup) {
    if (isPickup) {
        // Позиції коліс для Пікапа
        return [
            new THREE.Vector3(-1.225, 0.01, 0.85),
            new THREE.Vector3(1.93, 0.01, 0.75),
            new THREE.Vector3(-1.225, 0.01, -0.85),
            new THREE.Vector3(1.93, 0.01, -0.75)
        ];
    } else {
        // Позиції коліс для Спринтера
        return [
            new THREE.Vector3(-1.67, 0.01, 0.85),
            new THREE.Vector3(1.93, 0.01, 0.85),
            new THREE.Vector3(-1.67, 0.01, -0.85),
            new THREE.Vector3(1.93, 0.01, -0.85)
        ];
    }
}

export function addWheelsV1(scene, callback) {
    state.activeWheels = true;
    gltfLoader.load('./models/Wheels/v1/tuner_wheel.glb', (glb) => {
        const wheel = glb.scene;
        wheel.scale.set(0.14, 0.14, 0.14);
        wheel.rotateY(Math.PI * -0.5);
        wheel.traverse((child) => {
            if (child.isMesh) {
                // child.castShadow = true;   // колесо відкидає тінь
                child.receiveShadow = true; // колесо отримує тінь
            }
        });
        
        // Отримати позиції для поточної моделі
        positions = getWheelsV1Positions(state.aWasCalled);


        const wheels = [];

        positions.forEach((pos, index) => {
            const wheelClone = wheel.clone(); // клон колеса
            wheelClone.position.copy(pos);
            
       
            if (index === 2 || index === 3) {
                wheelClone.rotateY(Math.PI);
            }
            
            scene.add(wheelClone);
            wheels.push(wheelClone);
        });
        
      
        wheels.updatePositions = (isPickup) => {
            const newPositions = getWheelsV1Positions(isPickup);
            wheels.forEach((wheel, index) => {
                wheel.position.copy(newPositions[index]);
            });
        };
        
        // Повернути масив коліс через callback
        if (callback) callback(wheels);
    });

}