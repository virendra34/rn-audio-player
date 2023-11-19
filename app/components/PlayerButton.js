import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import color from '../misc/color';

const PlayerButton = (props) => {
    const { iconType, size = 40, iconColor = color.FONT } = props;

    const getIconName = (iconType) => {
        switch (iconType) {
            case 'PLAY':
                return 'playcircleo';
            case 'PAUSE':
                return 'pausecircleo';
            case 'NEXT':
                return 'stepforward';
            case 'PREV':
                return 'stepbackward';
        }
    }

    return (
        <AntDesign
            name={getIconName(iconType)}
            size={size}
            color={iconColor}
            {...props}
        />
    )
}

export default PlayerButton