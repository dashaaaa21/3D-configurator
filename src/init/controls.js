import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function createControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // обмеження камери 
    controls.maxPolarAngle = Math.PI * 0.49;

    // обмежений зум
    controls.maxDistance = 5;

    return controls;
}
