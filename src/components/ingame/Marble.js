import React from "react";
import { lightenOrDarkenColor, getKeyByValue } from '../../helpers/remysBestUtils';
import {colors} from '../../helpers/constants';
import { PickUpAndDrop } from '../transitions/PickUpAndDrop';

class Marble extends React.Component {

    render() {
        console.log(this.props.marble)
        let {color, isMovable, isVisible} = this.props.marble;
        let {left, top, size} = this.props.field;
        
        let scalePixels = 2;
        left -= scalePixels/2;
        top -= scalePixels/2;
        size += scalePixels;

        let colorDark = lightenOrDarkenColor(color, -70);
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
