import React from "react";
import { lightenOrDarkenColor } from '../../helpers/remysBestUtils';

class Marble extends React.Component {

    render() {
        let {color} = this.props;
        let {left, top, size} = this.props.field;
        
        let scalePixels = 2;
        left -= scalePixels/2;
        top -= scalePixels/2;
        size += scalePixels;

        let colorDark = lightenOrDarkenColor(this.props.color, -70);
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

        return (
            <div className="marble" style={styles}></div>
        );
    }
}

export default Marble;
