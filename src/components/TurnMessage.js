import React from 'react';

class TurnMessage extends React.Component {

    render() {
        return (
            <div className="turn-message">
                <div className="inner">
                    <p>It's <span>{this.props.turnNameToDisplay}</span> turn</p>
                </div>
            </div>
        );
    }
}

export default TurnMessage;