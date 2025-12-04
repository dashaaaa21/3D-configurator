import wheels1Img from '../assets/wheels1.jpg';
import wheels2Img from '../assets/wheels2.jpg';

export function createWheelsSwitcher(scene, addWheelsV1Fn, addWheelsV2Fn) {
    const container = document.createElement('div');
    container.className = 'wheels-switcher';
    
    let currentWheelsV1 = null;
    let currentWheelsV2 = null;
    
    container.innerHTML = `
        <div class="wheels-option active" data-wheels="v1">
            <img src="${wheels1Img}" alt="Wheels 1">
        </div>
        <div class="wheels-option" data-wheels="v2">
            <img src="${wheels2Img}" alt="Wheels 2">
        </div>
    `;
    
    const options = container.querySelectorAll('.wheels-option');
    
    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            const wheelsType = option.getAttribute('data-wheels');
            console.log('Selected wheels:', wheelsType);
            
            // Повідомити про зміну коліс
            if (container.onWheelsChange) {
                container.onWheelsChange(wheelsType);
            }
            
            // Сховати стандартні колеса моделі
            container.hideStandardWheels();
            
            if (wheelsType === 'v1') {
                // Сховати v2 колеса
                if (currentWheelsV2) {
                    currentWheelsV2.forEach(wheel => scene.remove(wheel));
                }
                
                // Показати v1 колеса
                if (!currentWheelsV1 && addWheelsV1Fn) {
                    addWheelsV1Fn(scene, (wheels) => {
                        currentWheelsV1 = wheels;
                    });
                } else if (currentWheelsV1) {
                    currentWheelsV1.forEach(wheel => scene.add(wheel));
                }
            } else if (wheelsType === 'v2') {
                // Сховати v1 колеса
                if (currentWheelsV1) {
                    currentWheelsV1.forEach(wheel => scene.remove(wheel));
                }
                
                // Показати v2 колеса
                if (!currentWheelsV2 && addWheelsV2Fn) {
                    addWheelsV2Fn(scene, (wheels) => {
                        currentWheelsV2 = wheels;
                    });
                } else if (currentWheelsV2) {
                    currentWheelsV2.forEach(wheel => scene.add(wheel));
                }
            }
        });
    });
    
    // Функція для оновлення позицій коліс при зміні моделі
    container.updateWheelsPositions = (isPickup) => {
        if (currentWheelsV1 && currentWheelsV1.updatePositions) {
            currentWheelsV1.updatePositions(isPickup);
        }
        if (currentWheelsV2 && currentWheelsV2.updatePositions) {
            currentWheelsV2.updatePositions(isPickup);
        }
    };
    
    // переключення коліс
    container.showActiveWheels = () => {
        const activeOption = container.querySelector('.wheels-option.active');
        if (activeOption) {
            const wheelsType = activeOption.getAttribute('data-wheels');
            
            if (wheelsType === 'v1' && currentWheelsV1) {
                currentWheelsV1.forEach(wheel => {
                    if (!scene.children.includes(wheel)) {
                        scene.add(wheel);
                    }
                });
            } else if (wheelsType === 'v2' && currentWheelsV2) {
                currentWheelsV2.forEach(wheel => {
                    if (!scene.children.includes(wheel)) {
                        scene.add(wheel);
                    }
                });
            }
        }
    };
    

    let sprinterModelRef = null;
    let pickupModelRef = null;
    
    container.setModels = (sprinter, pickup) => {
        sprinterModelRef = sprinter;
        pickupModelRef = pickup;
    };
    
    // колеса ховаються
    container.hideStandardWheels = () => {
        if (sprinterModelRef && sprinterModelRef.updateWheelsVisibility) {
            sprinterModelRef.updateWheelsVisibility(false);
        }
        if (pickupModelRef && pickupModelRef.updateWheelsVisibility) {
            pickupModelRef.updateWheelsVisibility(false);
        }
    };
    
    return container;
}
