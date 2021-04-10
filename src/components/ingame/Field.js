import React from "react";

class Field extends React.Component {

    render() {
        let {field} = this.props;
        let left = field.getLeft();
        let top = field.getTop();
        let size = field.getSize();
        let color = field.getColor();
        let borderWidth = field.getBorderWidth();

        // colored field
        if(color && borderWidth) {
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
            border: (color && borderWidth) ? `${borderWidth}px solid ${color}` : ''
        };

        return (
            <div className="field" style={styles}></div>
        );
    }
}

export default Field;