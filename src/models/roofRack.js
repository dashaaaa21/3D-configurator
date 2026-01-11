import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
const gltfLoader = new GLTFLoader();
const draco = new DRACOLoader();
draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
gltfLoader.setDRACOLoader(draco);
export function addRoofRack(scene, onLoad) {
    gltfLoader.load('./models/RoofRack/simple_generic_roofbox.glb', (glb) => {
        const model = glb.scene;
        model.position.set(0, 2.3, 0);
        model.scale.set(1.0, 1.0, 1.0);
        model.rotateY(Math.PI / 2);
        model.traverse((child) => {
            if (child.isMesh) {
                child.visible = true;
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                    child.material.color.set(0x2a2a2a);
                    child.material.metalness = 0.8;
                    child.material.roughness = 0.4;
                    child.material.needsUpdate = true;
                }
            }
        });
        scene.add(model);
        if (onLoad) onLoad(model);
    });
}
