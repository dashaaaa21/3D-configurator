import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { applyProps } from '../utils/applyMaterial';
const gltfLoader = new GLTFLoader();
const draco = new DRACOLoader();
draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
gltfLoader.setDRACOLoader(draco);
export function addTent(scene, callback) {
    gltfLoader.load('./models/Tent/tentv2.glb', (glb) => {
        const model = glb.scene;
        model.scale.set(0.065, 0.05, 0.11)
        model.rotateY(Math.PI / -2);
        model.position.set(-1.3, 1.26, -.03);
        model.traverse((child) => {
            if (child.isMesh) {
                applyProps(child, 'TANT__1', {
                    position: [-190, -130, -20],
                    scale: [1, 1, .7]
                });
                applyProps(child, 'TANT__2', {
                    scale: [1, 1, .77],
                    rotation: [Math.PI / 4.5, 0, 0],
                    position: [-190, 10, -55]
                });
            }
        })
        scene.add(model);
        if (callback) callback(model);
    })
}