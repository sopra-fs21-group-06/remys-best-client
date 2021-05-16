import React from 'react';
import Blurred from '../Blurred';

class Overlay extends React.Component {

    render() {
        return (
            <Blurred className="overlay">
                {this.props.component}
            </Blurred>
        );
    }
}

export default Overlay;