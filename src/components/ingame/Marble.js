import React from "react";
import { lightenOrDarkenColor } from '../../helpers/remysBestUtils';
import { PickUpAndDrop } from '../transitions/PickUpAndDrop';

class Marble extends React.Component {

    getOnClick(isMovable, isOnTargetField, marble, field) {
        if(isMovable) {
            return () => this.props.selectMarbleToPlay(marble)
        } else if(isOnTargetField) {
            return () => this.props.selectTargetField(field)
        }
        return null
    }

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
        let isPreviewMarble = marble.getIsPreviewMarble();
        let hasPreviewMarble = marble.getHasPreviewMarble();
        let isOnTargetField = field.getIsPossibleTargetField()

        let styles = {
            left: left + 'px',
            top: top + 'px',
            width: size + 'px',
            height: size + 'px',
            background: `radial-gradient(circle at ${size/3}px ${size/3}px, ${colorHex}, ${colorHexDark})`
        };

        return (
            <PickUpAndDrop in={isVisible}>
                <div 
                    onClick={this.getOnClick(isMovable, isOnTargetField, marble, field)} 
                    className={`marble ${colorName}` + (isMovable ? ' movable' : '') + (isOnTargetField ? ' clickable' : '') + (isPreviewMarble ? ' preview' : '') + (hasPreviewMarble ? ' hidden' : '')} 
                    style={styles}>
                </div>
            </PickUpAndDrop>
        );
    }
}

export default Marble;
