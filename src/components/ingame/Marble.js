import React from "react";
import { lightenOrDarkenColor, getKeyByValue } from '../../helpers/remysBestUtils';
import {colors} from '../../helpers/constants';
import { PickUpAndDrop } from '../transitions/PickUpAndDrop';

class Marble extends React.Component {

    render() {
        let {field, marble} = this.props;
        
        let scalePixels = 2;
        let left = field.getLeft() - scalePixels/2;
        let top = field.getTop() - scalePixels/2;
        let size = field.getSize() + scalePixels;
        let color = marble.getColor();
        let colorDark = lightenOrDarkenColor(color, -70);
        let isMovable = marble.getIsMovable();
        let isVisible = marble.getIsVisible();

        let styles = {
            position: 'absolute',
            display: 'block',
            borderRadius: '100%',
            left: left + 'px',
            top: top + 'px',
            width: size + 'px',
            height: size + 'px',
            background: colorDark,
            background: `radial-gradient(circle at ${size/3}px ${size/3}px, ${color}, ${colorDark})`
        };

        let movableClassNames;
        if(isMovable) {
            let colorName = getKeyByValue(colors, color).toLowerCase();
            movableClassNames = `movable ${colorName}`;
        }

        return (
            <PickUpAndDrop in={isVisible}>
                <div className={"marble " + (isMovable ? movableClassNames : '')} style={styles}></div>
            </PickUpAndDrop>
        );
    }
}

export default Marble;
