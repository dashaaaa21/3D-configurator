import * as THREE from 'three';
export function createPlane() {
    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.ShadowMaterial({ opacity: 0.4 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI * 0.5;
    mesh.receiveShadow = true;
    return mesh;
}