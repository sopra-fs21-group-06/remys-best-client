import React from "react";
import { FadeInOut } from '../../transitions/FadeInOut';
<<<<<<< HEAD

class MyHand extends React.Component {

    constructor() {
        super();
        this.state = {
            raisedCard: null
        };
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
=======
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

    handleMoveListMessage(msg) {
        this.setState({ moves: msg.moves })
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

    exchange() {
        let cardToExchange = this.state.raisedCard
        this.context.sockClient.send(`/app/game/${this.gameId}/card-exchange`, {code: cardToExchange.getCode()});
        this.props.myHandRef.current.removeCard(cardToExchange)
        this.resetRaiseCard()
    }

    requestMarbles(moveName) {
        this.setState({ selectedMoveName: moveName })
        this.context.sockClient.send(`/app/game/${this.gameId}/marble-request`, {code: this.state.raisedCard.getCode(), moveName: moveName}); 
        this.resetMoves()
    }

    requestMoves() {
        this.context.sockClient.send(`/app/game/${this.gameId}/move-request`, {code: this.state.raisedCard.getCode()}); 
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

    setIsMarbleChosen(isMarbleChosen) {
        this.setState({isMarbleChosen: isMarbleChosen})
    }

    resetSelectedMoveName() {
        this.setState({ selectedMoveName: null })
    }

    resetMoves() {
        this.setState({ moves: [] })
>>>>>>> dev
    }

    render() {
        return (
<<<<<<< HEAD
            <div>
                <div className="raised-card-options">
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
                <div className="raised-card-menu">
                    <FadeInOut in={true}>
                        <p>Choose Move</p>
                        <p>Choose Marble</p>
                        <p onClick={() => this.play()}>Play</p>
                        <p onClick={() => this.reset()}>Reset</p>
                    </FadeInOut>
                </div>
            </div>
=======
            <WebsocketConsumer channels={this.channels} >
                <div>
                    <div className="card-options">
                        <FadeInOut in={this.state.moves.length != 0}>
                            {this.state.moves.map(move => {
                                return (
                                    <div key={move.moveName}><p className="clickable" onClick={() => this.requestMarbles(move.moveName)}>{move.moveName}</p></div>
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
>>>>>>> dev
        );
    }
}

export default MyHand;