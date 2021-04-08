import React from "react";
import { FadeInOut } from '../transitions/FadeInOut';

class RaisedCardOptions extends React.Component {
    
    render() {
        return (
            <div className="raised-card-options">
                <FadeInOut
                    in={this.props.raisedCard.length != 0}
                >
                    <p>forwards</p>
                    <p>4 backwards</p>
                    <p>split</p>
                    <p>go to start</p>
                    <p>exchange</p>
                </FadeInOut>
            </div>
        );
    }
}

export default RaisedCardOptions;