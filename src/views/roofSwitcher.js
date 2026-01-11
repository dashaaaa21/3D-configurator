export function createRoofSwitcher(scene, addRoofRack) {
    const switcher = document.createElement('div');
    switcher.className = 'roof-switcher';
    switcher.style.display = 'none';
    switcher.innerHTML = `
        <div class="roof-switcher-container">
            <h3>Roof Rack</h3>
            <div class="roof-options">
                <button class="roof-option active" data-roof="none">
                    <span class="roof-label">No Roof Rack</span>
                </button>
                <button class="roof-option" data-roof="rack">
                    <span class="roof-label">Add Roof Rack</span>
                </button>
            </div>
        </div>
    `;
    let currentRoofRack = null;
    let activeRoof = 'none';
    const roofButtons = switcher.querySelectorAll('.roof-option');
    roofButtons.forEach(button => {
        button.addEventListener('click', () => {
            const roofType = button.getAttribute('data-roof');
            roofButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            if (currentRoofRack) {
                scene.remove(currentRoofRack);
                currentRoofRack = null;
            }
            if (roofType === 'rack') {
                addRoofRack(scene, (model) => {
                    currentRoofRack = model;
                });
            }
            activeRoof = roofType;
        });
    });
    switcher.clearRoof = () => {
        if (currentRoofRack) {
            scene.remove(currentRoofRack);
            currentRoofRack = null;
        }
        activeRoof = 'none';
        roofButtons.forEach(btn => btn.classList.remove('active'));
        roofButtons[0].classList.add('active');
    };
    switcher.setSprinterModel = () => {};
    switcher.getActiveRoof = () => activeRoof;
    return switcher;
}
