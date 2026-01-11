import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { state } from '../utils/state';
const gltfLoader = new GLTFLoader();
let positions;
function getWheelsV2Positions(isPickup) {
    if (isPickup) {
        return [
            new THREE.Vector3(-1.315, 0.37, 1),
            new THREE.Vector3(1.845, 0.37, 0.9),
            new THREE.Vector3(-1.14, 0.37, -1),
            new THREE.Vector3(2, 0.37, -0.9)
        ];
    } else {
        return [
            new THREE.Vector3(-1.75, 0.37, 1.02),
            new THREE.Vector3(1.845, 0.37, 1.02),
            new THREE.Vector3(-1.6, 0.37, -1.02),
            new THREE.Vector3(2, 0.37, -1.02)
        ];
    }
}
export function addWheelsV2(scene, callback) {
    state.activeWheels = true;
    gltfLoader.load('./models/Wheels/v2/scene.gltf', (glb) => {
        const wheel = glb.scene;
        wheel.scale.set(.00062, .00062, .00062);
        wheel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        positions = getWheelsV2Positions(state.aWasCalled);
        const wheels = [];
        positions.forEach((pos, index) => {
            const wheelClone = wheel.clone();
            wheelClone.position.copy(pos);
            if (index === 2 || index === 3) {
                wheelClone.rotateY(Math.PI);
            }
            scene.add(wheelClone);
            wheels.push(wheelClone);
        });
        wheels.updatePositions = (isPickup) => {
            const newPositions = getWheelsV2Positions(isPickup);
            wheels.forEach((wheel, index) => {
                wheel.position.copy(newPositions[index]);
            });
        };
        if (callback) callback(wheels);
    });
}