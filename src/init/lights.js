import * as THREE from 'three';
export function createLights() {
    const directional = new THREE.DirectionalLight(0xffffff, 1.2);
    directional.position.set(0, 5, 0);
    directional.castShadow = true;
    directional.shadow.mapSize.width = 512;
    directional.shadow.mapSize.height = 512;
    directional.shadow.camera.near = 0.5;
    directional.shadow.camera.far = 50;
    directional.shadow.camera.left = -5;
    directional.shadow.camera.right = 5;
    directional.shadow.camera.top = 5;
    directional.shadow.camera.bottom = -5;
    const ambient = new THREE.AmbientLight(0x404040);
    return { directional, ambient };
}
