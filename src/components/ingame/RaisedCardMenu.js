import React from "react";
import { FadeInOut } from '../transitions/FadeInOut';

class RaisedCardMenu extends React.Component {
    
    render() {
        return (
            <div className="raised-card-menu">
                <FadeInOut in={true}>
                    <p>Choose Move</p>
                    <p>Choose Marble</p>
                    <p onClick={() => this.props.handlePlayCards(this.props.raisedCard)}>Play Card</p>
                </FadeInOut>
            </div>
        );
    }
}

export default RaisedCardMenu;