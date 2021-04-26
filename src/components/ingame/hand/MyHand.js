import React from "react";
import { FadeInOut } from '../../transitions/FadeInOut';
import { roundModes } from '../../../helpers/constants';
import { WebsocketContext } from '../../websocket/WebsocketProvider';
import sessionManager from "../../../helpers/sessionManager";
import WebsocketConsumer from '../../websocket/WebsocketConsumer';
import { createChannel } from '../../../helpers/modelUtils';

class MyHand extends React.Component {

    static contextType = WebsocketContext;

    constructor() {
        super();
        this.state = {
            raisedCard: null,
            selectedMoveName: null,
            moves: [],
            isMarbleChosen: false
        };
        this.gameId = sessionManager.getGameId();
        this.handleRaiseCard = this.handleRaiseCard.bind(this);

        this.channels = [
            createChannel(`/user/queue/game/${this.gameId}/move-list`, (msg) => this.handleMoveListMessage(msg)),
        ]
    }

    getCardToPlay() {
        return this.state.raisedCard;
    }

    getMoveNameToPlay() {
        return this.state.selectedMoveName;
    }

    resetRaiseCard() {
        this.handleRaiseCard(null)
    }

    handleRaiseCard(card) {
        if(card === null || this.state.raisedCard === card) {
            this.setState({raisedCard: null});
            this.resetMoves();
            this.resetSelectedMoveName();
        } else {
            this.setState({raisedCard: card}, () => {
                if(this.props.mode === roundModes.MY_TURN) {
                    this.requestMoves();
                }
            });
        }
        this.props.myHandRef.current.raiseCard(card);
    }

    reset() {
        console.log("reset")
    }

    handleMoveListMessage(msg) {
        console.log("move list received")
        console.log(msg)

        this.setState({ moves: msg.moves })
    }

    requestMoves() {
        this.context.sockClient.send(`/app/game/${this.gameId}/move-request`, {code: this.state.raisedCard.getCode()}); 
    }

    resetMoves() {
        this.setState({ moves: [] })
    }

    resetSelectedMoveName() {
        this.setState({ selectedMoveName: null })
    }

    requestMarbles(moveName) {
        this.setState({ selectedMoveName: moveName })
        this.context.sockClient.send(`/app/game/${this.gameId}/marble-request`, {code: this.state.raisedCard.getCode(), moveName: moveName}); 
        this.resetMoves()
    }

    exchange() {
        let cardToExchange = this.state.raisedCard
        this.context.sockClient.send(`/app/game/${this.gameId}/card-exchange`, {code: cardToExchange.getCode()});
        this.props.myHandRef.current.removeCard(cardToExchange)
        this.resetRaiseCard()
    }

    setIsMarbleChosen(isMarbleChosen) {
        this.setState({isMarbleChosen: isMarbleChosen})
    }


    render() {
        return (
            <WebsocketConsumer channels={this.channels} >
                <div>
                    <div className="card-options">
                        <FadeInOut in={this.state.moves.length != 0}>
                            {this.state.moves.map(move => {
                                return (
                                    <div><p key={move.moveName} className="clickable" onClick={() => this.requestMarbles(move.moveName)}>{move.moveName}</p></div>
                                );
                            })}
                        </FadeInOut>
                    </div>
                    <div className="my-hand-wrapper">
                        {React.cloneElement(this.props.children, { onCardClick: this.handleRaiseCard})}
                    </div>
                    <div className="card-menu">
                        <FadeInOut in={this.props.mode === roundModes.EXCHANGE && this.state.raisedCard != null}>
                            <p className="clickable" onClick={() => this.exchange()}>{this.state.raisedCard && "Send " + this.state.raisedCard.getValue()}</p>
                        </FadeInOut>
                        <FadeInOut in={this.props.mode === roundModes.MY_TURN}>
                            <div><p>{"Choose Move"}{this.state.selectedMoveName && (" (" + this.state.selectedMoveName + ")")}</p></div>
                            <div><p>{"Choose Marble"}{this.state.isMarbleChosen && (" (chosen)")}</p></div>
                            <div><p className="clickable" onClick={() => this.props.play()}>Play</p></div>
                            <div><p className="clickable" onClick={() => this.props.reset()}>Reset</p></div>
                        </FadeInOut>
                    </div>
                </div>
            </WebsocketConsumer>
        );
    }
}

export default MyHand;