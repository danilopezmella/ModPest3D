import React from 'react';
import CloseIcon from './assets/icons/close.svg'; // Ruta al ícono de cerrar
import MinusIcon from './assets/icons/min.svg'; // Ruta al ícono de minimizar
import MaximizeIcon from './assets/icons/max.svg'; // Ruta al ícono de maximizar

// Define las claves válidas para los íconos
type IconName = 'close' | 'minus' | 'maximize';

// Define las props del componente
interface IconProps {
    name: IconName; // Solo acepta 'close', 'minus' o 'maximize'
    [key: string]: any; // Permite props adicionales
}

const Icon: React.FC<IconProps> = ({ name, ...props }) => {
    // Mapa de los íconos
    const icons: Record<IconName, string> = {
        close: CloseIcon,
        minus: MinusIcon,
        maximize: MaximizeIcon,
    };

    // Obtiene el ícono correspondiente
    const IconSrc = icons[name];

    // Renderiza el ícono si existe
    return IconSrc ? <img src={IconSrc} alt={name} {...props} className={`icon icon-${name}`}  /> : null;
};

export default Icon;
