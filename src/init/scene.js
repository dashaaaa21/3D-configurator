import * as THREE from 'three';
export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#C0C0C0');
    scene.position.y = -1; 
    return scene;
}
