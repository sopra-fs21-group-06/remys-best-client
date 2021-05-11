import React from 'react';

class Overlay extends React.Component {

    render() {
        return (
            <div className="overlay">
                {this.props.component}
            </div>
        );
    }
}

export default Overlay;