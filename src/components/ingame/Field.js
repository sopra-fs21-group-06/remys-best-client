import React from "react";

class Field extends React.Component {

    render() {
        let {left, top, size, color, borderWidth} = this.props.field;
        
        let globalStyles = {
            position: 'absolute',
            display: 'block',
            borderRadius: '100%',
            background: '#D0AE8B',
            boxShadow: 'inset 2px 2px 4px #ad9073, inset -2px -2px 4px #f3cca3'
        };

        let individualStyles = {}

        if(color && borderWidth) {
            individualStyles = {
                ...individualStyles,
                border: `${borderWidth}px solid ${color}`
            }
            let offset = 2 * borderWidth;
            left -= offset/2;
            top -= offset/2;
            size += offset
        } 

        individualStyles = {
            ...individualStyles,
            left: left + 'px',
            top: top + 'px',
            width: size + 'px',
            height: size + 'px'
        }

        return (
            <div className="field" style={{...globalStyles, ...individualStyles}}></div>
        );
    }
}

export default Field;