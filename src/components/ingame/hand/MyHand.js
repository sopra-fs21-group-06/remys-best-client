import React from "react";
import { FadeInOut } from '../../transitions/FadeInOut';
import { DelayedFadeInOut } from '../../transitions/DelayedFadeInOut';
import { roundModes } from '../../../helpers/constants';
import { WebsocketContext } from '../../context/WebsocketProvider';
import sessionManager from "../../../helpers/sessionManager";
import checkmark from '../../../img/checkmark.png';
import arrowRight from '../../../img/arrow-right.png';
import { withForegroundContext } from '../../context/ForegroundProvider';
import CardOverview from '../../CardOverview';

class MyHand extends React.Component {

    static contextType = WebsocketContext;

    constructor() {
        super();
        this.state = {
            raisedCard: null,
            chosenJokerCard: null,
            moves: [],
            selectedMoveName: null,
            isMarbleChosen: false,
        };
        this.gameId = sessionManager.getGameId();
        this.onCardClick = this.onCardClick.bind(this);
        this.handleJokerCardChosen = this.handleJokerCardChosen.bind(this);
    }

    handleRaiseCard(card) {
        if(card === null || this.state.raisedCard === card) {
            this.setState({raisedCard: null});
            this.resetMoves();
            this.resetSelectedMoveName();
        } else {
            this.setState({raisedCard: card}, () => {
                if(this.props.mode === roundModes.MY_TURN) {
                    this.props.requestMoves();
                }
            });
        }
        this.props.myHandRef.current.raiseCard(card);
    }

    handlePlayableCards(playableCardCodes) {
        playableCardCodes.forEach(cardCode => {
            this.props.myHandRef.current.markCardAsPlayable(cardCode)
        })
    }

    handleJokerCardChosen(jokerCard, chosenCard) {
        this.props.foregroundContext.closeOverlay()
        this.setState({ chosenJokerCard: chosenCard }, this.handleRaiseCard(jokerCard))

    }

    onCardClick(card) {
        if(card.getIsPlayable()) {
            this.props.myHandRef.current.resetMarkedCardsAsPlayable()
        }
        
        if(this.props.mode === roundModes.MY_TURN && (card.getCode() === "X1" || card.getCode() === "X2") && !card.getIsRaised()) {
            this.props.foregroundContext.openOverlay(<CardOverview jokerCard={card} handleJokerCardChosen={this.handleJokerCardChosen} />);
        } else {
            this.handleRaiseCard(card)
        }
    }

    exchange() {
        let cardToExchange = this.state.raisedCard
        this.context.sockClient.send(`/app/game/${this.gameId}/card-exchange`, {code: cardToExchange.getCode()});
        this.props.myHandRef.current.removeCard(cardToExchange)
        this.resetRaiseCard()
    }

    updateSelectedMoveName(moveName) {
        this.setState({ selectedMoveName: moveName })
    }

    updateMoves(moves) {
        this.setState({ moves: moves })
    }

    getRaisedCard(showActualJokerCard) {
        // pretend chosen joker card as raised card
        if(this.state.chosenJokerCard && !showActualJokerCard) {
            return this.state.chosenJokerCard
        }
        return this.state.raisedCard;
    }

    isJokerRaised() {
        return this.state.chosenJokerCard !== null;
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
        this.setState({ chosenJokerCard: null })
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
        if(raisedCard == null) {
            arrowRightTop = 0 * distance
        } else if(raisedCard != null && selectedMoveName == null) {
            arrowRightTop = 1 * distance
        } else if(raisedCard != null && selectedMoveName != null && !isMarbleChosen) {
            arrowRightTop = 2 * distance
        } else {
            arrowRightTop = 3 * distance
        }

        return (
            <div>
                <div className="card-options">
                    <FadeInOut in={moves.length != 0}>
                        {moves.map(move => {
                            return (
                                <div key={move.moveName}><p className="clickable" onClick={() => this.props.requestPossibleMarbles(move.moveName)}>{move.moveName}</p></div>
                            );
                        })}
                    </FadeInOut>
                </div>
                <div className="my-hand-wrapper">
                    {React.cloneElement(this.props.children, { onCardClick: this.onCardClick })}
                </div>
                <div className="card-menu">
                    <FadeInOut in={this.props.mode === roundModes.EXCHANGE && raisedCard != null}>
                        <p className="clickable" onClick={() => this.exchange()}>{raisedCard && "Send " + raisedCard.getValue()}</p>
                    </FadeInOut>
                    <FadeInOut in={this.props.mode === roundModes.MY_TURN}>
                        <div className="step">
                            <img className="arrow-right" src={arrowRight} style={{top: `calc(50% + ${arrowRightTop}px)`}} />
                            <DelayedFadeInOut in={raisedCard != null}>
                                <img className="checkmark" src={checkmark} />
                            </DelayedFadeInOut>
                            <p>Pick Card</p>
                        </div>

                        <div className={"step " + (raisedCard != null ? '' : 'inactive')}>
                            <DelayedFadeInOut in={raisedCard != null && selectedMoveName != null}>
                                <img className="checkmark" src={checkmark} />
                            </DelayedFadeInOut>
                            <p>Pick Move</p>
                        </div>
                        <div className={"step " + (raisedCard != null && selectedMoveName != null ? '' : 'inactive')}>
                            <DelayedFadeInOut in={raisedCard != null && selectedMoveName != null && isMarbleChosen}>
                                <img className="checkmark" src={checkmark} />
                            </DelayedFadeInOut>
                            <p>Pick Marble + Target</p>
                        </div>

                        <div className="actions">
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
        );
    }
}

export default withForegroundContext(MyHand);