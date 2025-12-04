import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
export function addLightInSprinter(scene) {
    gltfLoader.load('./models/lights/sunstrip_led_bar/scene.gltf', (gltf) => {
        const model = gltf.scene;
        model.rotateY(Math.PI / 2);
        model.rotateX(Math.PI / 2);
        model.position.set(1.9, .53, 2.5)
        scene.add(model);
    })
}
