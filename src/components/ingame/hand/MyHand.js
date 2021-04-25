import React from "react";
import { FadeInOut } from '../../transitions/FadeInOut';
import { roundModes } from '../../../helpers/constants';
import { WebsocketContext } from '../../websocket/WebsocketProvider';
import sessionManager from "../../../helpers/sessionManager";
import WebsocketConsumer from '../..//websocket/WebsocketConsumer';
import { createChannel } from '../../../helpers/modelUtils';

class MyHand extends React.Component {

    static contextType = WebsocketContext;

    constructor() {
        super();
        this.state = {
            raisedCard: null,
            selectedMoveName: null,
            moves: [],
        };
        this.gameId = sessionManager.getGameId();
        this.handleRaiseCard = this.handleRaiseCard.bind(this);

        this.channels = [
            createChannel(`/user/queue/game/${this.gameId}/move-list`, (msg) => this.handleMoveListMessage(msg)),
            createChannel(`/user/queue/game/${this.gameId}/marble-list`, (msg) => this.handleMarbleListMessage(msg))
        ]
    }

    handleRaiseCard(card) {
        console.log("MyHand - raise card")
        if(this.state.raisedCard == card) {
            this.setState({raisedCard: null});
        } else {
            this.setState({raisedCard: card}, () => {
                if(this.props.mode === roundModes.MY_TURN) {
                    this.requestMoves();
                }
            });
        }
        this.props.handRef.current.raiseCard(card);
    }

    play() {
        console.log("MyHand - play")
        this.props.playMyCard(this.state.raisedCard, null)
        this.handleRaiseCard(null);

        // TODO seven, send marble ids aswell
        this.context.sockClient.send(`/app/game/${this.gameId}/play`, {code: this.state.raisedCard.getCode(), moveName: this.state.selectedMoveName});
    }

    reset() {
        console.log("reset")
    }

    handleMoveListMessage(msg) {
        console.log("move list received")
        console.log(msg)

        this.setState({ moves: msg.moves })
    }

    handleMarbleListMessage(msg) {
        console.log("marble list received")
        console.log(msg)

        this.props.handleMovableMarbles(msg.marbles)
    }

    requestMoves() {
        this.context.sockClient.send(`/app/game/${this.gameId}/move-request`, {code: this.state.raisedCard.getCode()}); 
    }

    requestMarbles(moveName) {
        this.setState({ selectedMoveName: moveName })
        this.context.sockClient.send(`/app/game/${this.gameId}/marble-request`, {code: this.state.raisedCard.getCode(), moveName: moveName}); 
    }

    exchange() {
        this.handleRaiseCard(null)
        this.props.exchange(this.state.raisedCard)
    }

    render() {
        return (
            <WebsocketConsumer channels={this.channels} >
                <div>
                    <div className="card-options">
                        <FadeInOut in={this.state.moves.length != 0}>
                            {this.state.moves.map(move => {
                                return (
                                    <p key={move.moveName} onClick={() => this.requestMarbles(move.moveName)}>{move.moveName}</p>
                                );
                            })}
                        </FadeInOut>
                    </div>
                    <div className="my-hand-wrapper">
                        {React.cloneElement(this.props.children, { onCardClick: this.handleRaiseCard})}
                    </div>
                    <div className="card-menu">
                        <FadeInOut in={this.props.mode === roundModes.EXCHANGE && this.state.raisedCard != null}>
                            <p onClick={() => this.exchange()}>{this.state.raisedCard && "Send " + this.state.raisedCard.getValue()}</p>
                        </FadeInOut>
                        <FadeInOut in={this.props.mode === roundModes.MY_TURN}>
                            <p>Choose Move</p>
                            <p>Choose Marble</p>
                            <p onClick={() => this.play()}>Play</p>
                            <p onClick={() => this.reset()}>Reset</p>
                        </FadeInOut>
                    </div>
                </div>
            </WebsocketConsumer>
        );
    }
}

export default MyHand;