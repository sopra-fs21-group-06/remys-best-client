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
        let colorName = marble.getColor().name;
        let colorHex = marble.getColor().hex;
        let colorHexDark = lightenOrDarkenColor(colorHex, -70);
        let isMovable = marble.getIsMovable();
        let isVisible = marble.getIsVisible();

        let styles = {
            left: left + 'px',
            top: top + 'px',
            width: size + 'px',
            height: size + 'px',
            background: colorHexDark,
            background: `radial-gradient(circle at ${size/3}px ${size/3}px, ${colorHex}, ${colorHexDark})`
        };

        return (
            <PickUpAndDrop in={isVisible}>
<<<<<<< HEAD
                <div onClick={isMovable ? () => this.props.selectMarbleToPlay(marble) : null} className={`marble ${colorName}` + (isMovable ? ' movable' : '')} style={styles}></div>
=======
                <div className={`marble ${colorName}` + (isMovable ? ' movable' : '')} style={styles}></div>
>>>>>>> 1d7b81c (websocket basic implementation, first test until game screen (#111))
            </PickUpAndDrop>
        );
    }
}

export default Marble;
