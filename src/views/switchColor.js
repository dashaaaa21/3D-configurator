import { applyProps } from "../utils/applyMaterial";
export function createColorSwitcher(model) {
    const colorSwitcher = document.createElement('div');
    colorSwitcher.className = 'color-switcher';

    let carModel = model;

    const colors = [
        { name: 'red', value: '#FFFFFF' },
        { name: 'blue', value: '#544643' },
        { name: 'green', value: '#262626' },
        { name: 'yellow', value: '#f59e0b' },
        { name: 'gradient', value: 'conic-gradient(red, yellow, green, blue, red)' }
    ];


    let circlesHTML = '';
    colors.forEach((color, index) => {
        const activeClass = index === 0 ? 'active' : '';
        circlesHTML += `
            <div class="color-circle ${activeClass}" 
                 data-color="${color.value}" 
                 data-name="${color.name}"
                 style="background: ${color.value};">
            </div>
        `;
    });

    colorSwitcher.innerHTML = circlesHTML;

    let inputColor = document.createElement('input');
    inputColor.type = 'color';
    inputColor.classList.add('inputColor')
    colorSwitcher.appendChild(inputColor);


    const circles = colorSwitcher.querySelectorAll('.color-circle');

    let onColorChange = null;

    inputColor.addEventListener('input', (e) => {
        if (carModel) {
            carModel.traverse((child) => {
                if (child.isMesh && child.material) {
                    const mat = child.material;
                    applyProps(mat, 'UTLTRUCK90_Bodymat', { color: e.target.value });
                    applyProps(mat, 'Carrosserie', { color: e.target.value });
                }
            });
        }

    })
    circles.forEach(circle => {
        circle.addEventListener('click', () => {
            circles.forEach(c => c.classList.remove('active'));


            circle.classList.add('active');


            const color = circle.getAttribute('data-color');
            const colorName = circle.getAttribute('data-name');

            console.log(`Вибраний колір: ${colorName} (${color})`);

            if (onColorChange) {
                onColorChange(colorName);
            }


            if (carModel) {
                carModel.traverse((child) => {
                    if (child.isMesh && child.material) {
                        const mat = child.material;

                        // Змінюємо колір кузова
                        applyProps(mat, 'UTLTRUCK90_Bodymat', {
                            color: color
                        })
                        applyProps(mat, 'Carrosserie', {
                            color: color
                        })
                    }
                });
            }
        });
    });

    colorSwitcher.onColorChange = (callback) => {
        onColorChange = callback;
    };

    colorSwitcher.setModel = (model) => {
        carModel = model;
        console.log('Модель Mercedes Sprinter підключена до перемикача кольорів');
    };

    return colorSwitcher;
}