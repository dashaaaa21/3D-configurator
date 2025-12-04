export function applyProps(obj, name, props) {
    if (obj.name !== name) return null;

    for (const [key, value] of Object.entries(props)) {
        if (key === 'color' && obj.color) {
            if (Array.isArray(value)) {
                obj.color.setRGB(...value);
            } else if (typeof value === 'string') {
                obj.color.set(value);
            }
        } else if (['position', 'rotation', 'scale'].includes(key) && obj[key] !== undefined) {
            // Очікуємо, що value це THREE.Vector3 або масив [x,y,z]
            if (Array.isArray(value)) {
                obj[key].set(...value);
            } else if (value.isVector3 || value.isEuler) {
                obj[key].copy(value);
            }
        } else {
            obj[key] = value;
        }
    }

    if (obj.isMaterial) obj.needsUpdate = true;

    return obj;
}