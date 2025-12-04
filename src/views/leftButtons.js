export function createLeftButtons(onCategoryChange) {
    const leftPanel = document.createElement('div');
    leftPanel.className = 'left-panel';
    
    leftPanel.innerHTML = `
        <button class="left-btn" data-category="wheels">WHEELS</button>
        <button class="left-btn" data-category="roof">ROOF</button>
        <button class="left-btn" data-category="sidebars">SIDE BARS</button>
        <button class="left-btn" data-category="camping">CAMPING</button>
    `;
    
    const buttons = leftPanel.querySelectorAll('.left-btn');
    const campingBtn = leftPanel.querySelector('[data-category="camping"]');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            const isActive = button.classList.contains('active');
            
            // Якщо кнопка вже активна - деактивувати її
            if (isActive) {
                button.classList.remove('active');
                // Повідомити про деактивацію
                if (onCategoryChange) {
                    onCategoryChange(null);
                }
            } else {
                // Видалити active з усіх кнопок
                buttons.forEach(btn => btn.classList.remove('active'));
                
                // Додати active до натиснутої кнопки
                button.classList.add('active');
                
                // Повідомити про зміну категорії
                if (onCategoryChange) {
                    onCategoryChange(category);
                }
            }
            
            console.log(`Вибрана категорія: ${isActive ? 'none' : category}`);
        });
    });
    
    // Функція для оновлення доступності кнопки CAMPING
    leftPanel.updateCampingAvailability = (isPickup) => {
        if (isPickup) {
            campingBtn.disabled = false;
            campingBtn.style.opacity = '1';
            campingBtn.style.cursor = 'pointer';
        } else {
            campingBtn.disabled = true;
            campingBtn.style.opacity = '0.5';
            campingBtn.style.cursor = 'not-allowed';
            campingBtn.classList.remove('active');
        }
    };
    
    // За замовчуванням CAMPING недоступний (Sprinter)
    leftPanel.updateCampingAvailability(false);
    
    return leftPanel;
}