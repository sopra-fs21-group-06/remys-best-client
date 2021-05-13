import React from 'react';

class Alert extends React.Component {

    render() {
        return (
            <div className="alert">
                {this.props.component ? React.cloneElement(this.props.component, { countdown: this.props.countdown}) : null}
            </div>
        );
    }
}

export default Alert;