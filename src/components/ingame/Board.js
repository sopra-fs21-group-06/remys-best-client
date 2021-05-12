import React from "react";
import wood from '../../img/board.png';
import { initMarbles, computeFields } from '../../helpers/remysBestUtils';
import Marble from './Marble';
import Field from './Field';
import { ThrowIn } from '../transitions/ThrowIn';
import { TransitionGroup } from 'react-transition-group';
import Card from "./hand/Card";
import { api } from '../../helpers/api';
import sessionManager from "../../helpers/sessionManager";

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            size: this.props.size,
            fields: [],
            marbles: [],
            playedCards: [],
            bottomClass: "BLUE-bottom",
            sevenMoves: [],
            remainingSevenMoves: 7
        };
        this.selectMarbleToPlay = this.selectMarbleToPlay.bind(this)
        this.selectTargetField = this.selectTargetField.bind(this)

        this.gameId = sessionManager.getGameId();
    }

    componentDidMount() {       
        this.setState({
            fields: computeFields(this.state.size),
            marbles: initMarbles()
        })
    }

    updatePossibleMarbles(marbles) {
        this.updateMovableMarbles(marbles)
    }

    updateMovableMarbles(movableMarbles) {
        let newMarbles = [];

        if(movableMarbles.length == 0) {
            newMarbles = this.state.marbles.map(marble => {
                marble.setIsMovable(false)
                return marble;
            });
        } else {
            let movableMarbleIds = movableMarbles.map(marble => {return marble.marbleId})
            newMarbles = this.state.marbles.map(marble => {
                if(movableMarbleIds.includes(marble.getId())) {
                    marble.setIsMovable(true)
                    return marble;
                } 
                marble.setIsMovable(false)
                return marble;
            });
        }

        this.setState({marbles: newMarbles});
    }

    updatePossibleTargetFields(possibleTargetFieldKeys) {
        let newFields = [];

        if(possibleTargetFieldKeys.length == 0) {
            newFields = this.state.fields.map(field => {
                field.setIsPossibleTargetField(false)
                return field;
            });
        } else {
            newFields = this.state.fields.map(field => {
                if(possibleTargetFieldKeys.includes(field.getKey())) {
                    field.setIsPossibleTargetField(true)
                    return field;
                } 
                field.setIsPossibleTargetField(false)
                return field;
            });
        }

        this.setState({fields: newFields});
    }

    throwInCard(player, card) {
        this.setState(prevState => {
            let handRot = player.getHandRot();
            let randomCardRot = (Math.random() * 31) -15

            let style = card.getStyle();
            style.rot = handRot + randomCardRot
            card.setStyle(style)
            
            return {playedCards: [...prevState.playedCards, card]};
      });
    }

    throwInAllCards(player, alignedCards) {
        this.setState(prevState => {
            let handRot = player.getHandRot();

            alignedCards.forEach(card => {
                let style = card.getStyle();
                style.rot = handRot
                card.setStyle(style)
            })

            return {playedCards: prevState.playedCards.concat(alignedCards)};
      });
    }

    moveMarble(marbleId, targetFieldKey) {
        // pick up
        this.setState(prevState => {
            const marbles = prevState.marbles.map(marble => {
                if (marble.getId() == marbleId) {
                    marble.setIsVisible(false);
                } 
                return marble;
            });
            return {marbles: marbles};
        });

        // drop to new field
        setTimeout(function(){ 
          this.setState(prevState => {
            const marbles = prevState.marbles.map(marble => {
              if (marble.getId() == marbleId) {
                  marble.setFieldKey(targetFieldKey)
                  marble.setIsVisible(true);
              } 
              return marble;
            });
            return {marbles: marbles};
          });
        }.bind(this), 1000);
    }

    selectMarble(marbleToSelect, callback) {
        this.setState(prevState => {
            const marbles = prevState.marbles.map(marble => {
                if (marbleToSelect && marble.getId() == marbleToSelect.getId()) {
                    marble.setIsSelected(true)
                    return marble;
                }
                marble.setIsSelected(false)
                return marble;
            });
            return {marbles: marbles};
        }, callback);     
    }

    async selectMarbleToPlay(marbleToPlay) {
        this.resetMovableMarbles()
        this.selectMarble(marbleToPlay, () => {
            this.props.requestPossibleTargetFields()
        })
    }

    selectTargetField(targetField) {
        this.setState(prevState => {
            const fields = prevState.fields.map(field => {
                field.setIsPossibleTargetField(false)
                if (targetField.getKey() == field.getKey()) {
                    field.setIsTargetField(true)
                    return field;
                }
                field.setIsTargetField(false)
                return field;
            });
            return {fields: fields};
        });

        // handle seven
        if(this.props.myHandContainerRef.current.isSevenRaised()) {
            let sevenMove = {marbleId: this.getMarbleToPlay().getId(), targetFieldKey: targetField.getKey()}
            this.setState({
                sevenMoves: [
                    ...this.state.sevenMoves,
                    sevenMove
                ],
            }, async () => {
                let remainingSevenMoves = await this.requestRemainingSevenMoves()
                console.log(remainingSevenMoves)
                this.setState({
                    remainingSevenMoves: remainingSevenMoves
                }, () => {
                    if(this.state.remainingSevenMoves > 0) {
                        this.props.requestPossibleMarbles(this.props.myHandContainerRef.current.getMoveNameToPlay())
                    } else {
                        this.props.myHandContainerRef.current.setIsMarbleAndTargetFieldChosen(true);
                    }
                })
            });            
        } else {
            this.props.myHandContainerRef.current.setIsMarbleAndTargetFieldChosen(true);
        }
    }

    async requestRemainingSevenMoves() {
        const requestBody = JSON.stringify({
            sevenMoves: this.state.sevenMoves
        });
        const response = await api.post(`/game/${this.gameId}/remaining-seven-moves`, requestBody);

        return parseInt(response.data.remainingSevenMoves)
    }

    getMarbleToPlay() {
        return this.state.marbles.find(marble => marble.getIsSelected());
    }

    getTargetField() {
        return this.state.fields.find(field => field.getIsTargetField());
    }

    getRemainingSevenMoves() {
        return this.state.remainingSevenMoves
    }

    getSevenMoves() {
        return this.state.sevenMoves
    }

    resetAll() {
        this.resetMovableMarbles()
        this.resetSelectedMarble()
        this.resetSevenMoves()
    }

    resetMovableMarbles() {
        this.updateMovableMarbles([]);
    }

    resetSelectedMarble() {
        this.selectMarble(null);
    }

    resetSevenMoves() {
        this.setState({ sevenMoves: [], remainingSevenMoves: 7 })
    }

    setBottomClass(bottomClass) {
        this.setState({bottomClass: bottomClass})
    }

    render() {
        return (
            <div className={"board " + this.state.bottomClass} style={{width: this.state.size, height: this.state.size}}>
                <img className="wood" src={wood} />
                <div className="fields">
                    {this.state.fields.map(field => {
                        return (
                            <Field 
                                key={field.getKey()} 
                                field={field}
                                selectTargetField={this.selectTargetField}
                            />
                        );
                    })}
                </div>
                <div className="marbles">
                    {this.state.marbles.map(marble => {
                        let field = this.state.fields.find(field => field.getKey() === marble.getFieldKey())
                        return (
                            <Marble 
                                key={marble.getId()}
                                marble={marble}
                                field={field}
                                selectMarbleToPlay={this.selectMarbleToPlay} 
                                selectTargetField={this.selectTargetField}       
                            />
                        );
                    })}
                </div>
                <TransitionGroup className="played-card-pile">
                    {this.state.playedCards ? Object.keys(this.state.playedCards).map(key => {
                        return (
                            <ThrowIn key={key}>
                                <Card card={this.state.playedCards[key]}/>
                            </ThrowIn>
                        );
                    }) : null}
                </TransitionGroup>
            </div>  
        );
    }
}

export default Board;