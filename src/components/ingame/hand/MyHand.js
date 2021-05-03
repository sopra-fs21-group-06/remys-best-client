import React from "react";
import { FadeInOut } from '../../transitions/FadeInOut';
import { DelayedFadeInOut } from '../../transitions/DelayedFadeInOut';
import { roundModes } from '../../../helpers/constants';
import { WebsocketContext } from '../../websocket/WebsocketProvider';
import sessionManager from "../../../helpers/sessionManager";
import WebsocketConsumer from '../../websocket/WebsocketConsumer';
import { createChannel } from '../../../helpers/modelUtils';
import checkmark from '../../../img/checkmark.png';
import arrowRight from '../../../img/arrow-right.png';

class MyHand extends React.Component {

    static contextType = WebsocketContext;

    constructor() {
        super();
        this.state = {
            raisedCard: null,
            moves: [],
            selectedMoveName: null,
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

    setIsMarbleChosen(isMarbleChosen) {
        this.setState({isMarbleChosen: isMarbleChosen})
    }

    resetAll() {
        this.resetRaiseCard()
        this.resetMoves()
        this.resetSelectedMoveName()
        this.resetIsMarbleChosen()
    }

    resetRaiseCard() {
        this.handleRaiseCard(null)
    }

    resetMoves() {
        this.setState({ moves: [] })
    }

    resetSelectedMoveName() {
        this.setState({ selectedMoveName: null })
    }

    resetIsMarbleChosen() {
        this.setState({ isMarbleChosen: false })
    }

    render() {
        let {selectedMoveName, isMarbleChosen, raisedCard, moves} = this.state
        let isPlayButtonActive = selectedMoveName != null && isMarbleChosen
        let isResetButtonActive = selectedMoveName != null
        let isThrowAwayVisible = selectedMoveName == null

        let distance = 24
        let arrowRightTop = 0;
        if(selectedMoveName == null) {
            arrowRightTop = 0 * distance
        } else if(selectedMoveName != null && !isMarbleChosen) {
            arrowRightTop = 1 * distance
        } else {
            arrowRightTop = 2 * distance
        }

        return (
            <WebsocketConsumer channels={this.channels} >
                <div>
                    <div className="card-options">
                        <FadeInOut in={moves.length != 0}>
                            {moves.map(move => {
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
                        <FadeInOut in={this.props.mode === roundModes.EXCHANGE && raisedCard != null}>
                            <p className="clickable" onClick={() => this.exchange()}>{raisedCard && "Send " + raisedCard.getValue()}</p>
                        </FadeInOut>
                        <FadeInOut in={this.props.mode === roundModes.MY_TURN}>
                            <div className="step">
                                <img className="arrow-right" src={arrowRight} style={{top: `calc(50% + ${arrowRightTop}px)`}} />
                                <DelayedFadeInOut in={selectedMoveName != null}>
                                    <img className="checkmark" src={checkmark} />
                                </DelayedFadeInOut>
                                <p>{"Choose Move"}{selectedMoveName && (" (" + selectedMoveName + ")")}</p>
                            </div>
                            <div className={"step " + (selectedMoveName != null ? '' : 'inactive')}>
                                <DelayedFadeInOut in={selectedMoveName != null && isMarbleChosen}>
                                    <img className="checkmark" src={checkmark} />
                                </DelayedFadeInOut>
                                <p>Choose Marble</p>
                            </div>

                            <div className="actions">
                                {/* delay on appear */}
                                <DelayedFadeInOut in={isThrowAwayVisible}>
                                    <div className="btn ">
                                        <p className='clickable' onClick={() => this.props.throwAway()}>Throw Away</p>
                                    </div>
                                </DelayedFadeInOut>
                                <DelayedFadeInOut in={!isThrowAwayVisible}>
                                    <div className={"btn " + (!isPlayButtonActive ? 'inactive' : '')}>
                                        <p className={isPlayButtonActive ? 'clickable' : ''} onClick={isPlayButtonActive ? () => this.props.play() : null}>Play</p>
                                    </div>
                                    <div className={"btn " + (!isResetButtonActive ? 'inactive' : '')}>
                                        <p className={isResetButtonActive ? 'clickable' : ''} onClick={isResetButtonActive ? () => this.props.reset() : null}>Reset</p>
                                    </div>
                                </DelayedFadeInOut>
                            </div>
                        </FadeInOut>
                    </div>
                </div>
            </WebsocketConsumer>
        );
    }
}

export default MyHand;