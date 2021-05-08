import React from 'react';

class Alert extends React.Component {

    render() {
        return (
            <div className="alert">
                {React.cloneElement(this.props.component, { countdown: this.props.countdown})}
            </div>
        );
    }
}

export default Alert;