import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { state } from '../utils/state';
const gltfLoader = new GLTFLoader();
let positions;
function getWheelsV1Positions(isPickup) {
    if (isPickup) {
        return [
            new THREE.Vector3(-1.225, 0.01, 0.85),
            new THREE.Vector3(1.93, 0.01, 0.75),
            new THREE.Vector3(-1.225, 0.01, -0.85),
            new THREE.Vector3(1.93, 0.01, -0.75)
        ];
    } else {
        return [
            new THREE.Vector3(-1.67, 0.01, 0.85),
            new THREE.Vector3(1.93, 0.01, 0.85),
            new THREE.Vector3(-1.67, 0.01, -0.85),
            new THREE.Vector3(1.93, 0.01, -0.85)
        ];
    }
}
function getWheelsV1Scale() {
    return 0.14;
}
export function addWheelsV1(scene, callback) {
    state.activeWheels = true;
    gltfLoader.load('./models/Wheels/v1/tuner_wheel.glb', (glb) => {
        const wheel = glb.scene;
        const scale = getWheelsV1Scale(state.aWasCalled);
        wheel.scale.set(scale, scale, scale);
        wheel.rotateY(Math.PI * -0.5);
        wheel.traverse((child) => {
            if (child.isMesh) {
                child.receiveShadow = true;
            }
        });
        positions = getWheelsV1Positions(state.aWasCalled);
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
            const newPositions = getWheelsV1Positions(isPickup);
            const newScale = getWheelsV1Scale();
            wheels.forEach((wheel, index) => {
                wheel.position.copy(newPositions[index]);
                wheel.scale.set(newScale, newScale, newScale);
            });
        };
        if (callback) callback(wheels);
    });
}