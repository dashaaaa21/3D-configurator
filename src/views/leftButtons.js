export function createLeftButtons(onCategoryChange) {
    const leftPanel = document.createElement('div');
    leftPanel.className = 'left-panel';
    leftPanel.innerHTML = `
        <button class="left-btn" data-category="wheels">WHEELS</button>
        <button class="left-btn" data-category="roof">ROOF</button>
        <button class="left-btn" data-category="camping">CAMPING</button>
    `;
    const buttons = leftPanel.querySelectorAll('.left-btn');
    const roofBtn = leftPanel.querySelector('[data-category="roof"]');
    const campingBtn = leftPanel.querySelector('[data-category="camping"]');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.disabled) {
                return;
            }
            const category = button.getAttribute('data-category');
            const isActive = button.classList.contains('active');
            if (isActive) {
                button.classList.remove('active');
                if (onCategoryChange) {
                    onCategoryChange(null);
                }
            } else {
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                if (onCategoryChange) {
                    onCategoryChange(category);
                }
            }
        });
    });
    leftPanel.updateAvailableButtons = (modelType) => {
        if (modelType === 'sprinter') {
            roofBtn.disabled = false;
            roofBtn.style.opacity = '1';
            roofBtn.style.cursor = 'pointer';
            campingBtn.disabled = true;
            campingBtn.style.opacity = '0.3';
            campingBtn.style.cursor = 'not-allowed';
        } else if (modelType === 'pickup') {
            roofBtn.disabled = true;
            roofBtn.style.opacity = '0.3';
            roofBtn.style.cursor = 'not-allowed';
            campingBtn.disabled = false;
            campingBtn.style.opacity = '1';
            campingBtn.style.cursor = 'pointer';
        }
    };
    leftPanel.updateAvailableButtons('sprinter');
    return leftPanel;
}