import React from "react";

class Field extends React.Component {

    render() {
        let {field} = this.props;
        let left = field.getLeft();
        let top = field.getTop();
        let size = field.getSize();
        let color = field.getColor();
<<<<<<< HEAD
        let borderWidth = field.getBorderWidth();

        // colored field
        if(color && borderWidth) {
=======
        let isColorShown = field.getIsColorShown();
        let borderWidth = field.getBorderWidth();
        let isPossibleTargetField = field.getIsPossibleTargetField();

        // colored field
        if(isColorShown) {
>>>>>>> dev
            let offset = 2 * borderWidth;
            left -= offset/2;
            top -= offset/2;
            size += offset
        }

        let styles = {
            position: 'absolute',
            left: left + 'px',
            top: top + 'px',
            width: size + 'px',
            height: size + 'px',
            borderRadius: '100%',
            background: '#D0AE8B',
            boxShadow: 'inset 2px 2px 4px #ad9073, inset -2px -2px 4px #f3cca3',
<<<<<<< HEAD
            border: (color && borderWidth) ? `${borderWidth}px solid ${color.hex}` : ''
        };

        return (
            <div className="field" style={styles}></div>
=======
            border: (isColorShown) ? `${borderWidth}px solid ${color.hex}` : ''
        };

        return (
            <div 
                onClick={isPossibleTargetField ? () => this.props.selectTargetField(field) : null} 
                className={"field" + (isPossibleTargetField ? " possibleTargetField" : '')} 
                style={styles}>
            </div>
>>>>>>> dev
        );
    }
}

export default Field;