import React from "react";
import { FadeInOut } from '../../transitions/FadeInOut';
import { roundModes } from '../../../helpers/constants';
import { WebsocketContext } from '../../websocket/WebsocketProvider';
import sessionManager from "../../../helpers/sessionManager";

class MyHand extends React.Component {

    static contextType = WebsocketContext;

    constructor() {
        super();
        this.state = {
            raisedCard: null
        };
        this.gameId = sessionManager.getGameId();
        this.handleRaiseCard = this.handleRaiseCard.bind(this);
    }

    handleRaiseCard(card) {
        console.log("MyHand - raise card")
        if(this.state.raisedCard == card) {
            this.setState({raisedCard: null});
        } else {
            this.setState({raisedCard: card});
        }
        this.props.handRef.current.raiseCard(card);
    }

    play() {
        console.log("MyHand - play")
        this.props.playMyCard(this.state.raisedCard, null)
        /*
        this.handRef.current.props.playCard([this.state.raisedCard]);
        this.handRef.current.removeCard([this.state.raisedCard]);
        this.setState({raisedCard: null});*/
    }

    reset() {
        console.log("reset")
    }

    render() {
        return (
            <div>
                <div className="card-options">
                    <FadeInOut in={this.state.raisedCard ? true : false}>
                        <p>forwards</p>
                        <p>4 backwards</p>
                        <p>split</p>
                        <p>go to start</p>
                        <p>exchange</p>
                    </FadeInOut>
                </div>
                <div className="my-hand-wrapper">
                    {React.cloneElement(this.props.children, { onCardClick: this.handleRaiseCard})}
                </div>
                <div className="card-menu">
                    <FadeInOut in={this.state.raisedCard != null && this.props.mode === roundModes.EXCHANGE}>
                        <p onClick={() => this.props.exchange(this.state.raisedCard)}>{this.state.raisedCard && "Send " + this.state.raisedCard.getName()}</p>
                    </FadeInOut>
                    <FadeInOut in={this.props.mode === roundModes.MY_TURN}>
                        <p>Choose Move</p>
                        <p>Choose Marble</p>
                        <p onClick={() => this.play()}>Play</p>
                        <p onClick={() => this.reset()}>Reset</p>
                    </FadeInOut>
                </div>
            </div>
        );
    }
}

export default MyHand;