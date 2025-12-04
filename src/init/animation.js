export function animate(renderer, scene, camera, controls, objects = []) {
    const tick = () => {
        controls.update();
        objects.forEach(obj => {
            if (obj.update) obj.update();
        });
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    };
    tick();
}
