import React from "react";
import wood from '../../../img/board.png';
import { initMarbles, computeFields } from '../../../helpers/remysBestUtils';
import { createPreviewMarble } from '../../../helpers/modelUtils';
import Marble from './Marble';
import Field from './Field';
import { ThrowIn } from '../../transitions/ThrowIn';
import { TransitionGroup } from 'react-transition-group';
import Card from "../hand/Card";
import { api, handleError } from '../../../helpers/api';
import sessionManager from "../../../helpers/sessionManager";
import { withForegroundContext } from '../../context/ForegroundProvider';
import ErrorMessage from "../../alert/ErrorMessage";

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

    updateMovableMarbles(movableMarbles) {
        let movableMarblesWithPreviewMarble = []
        let marbles = this.getMarblesWithoutPreviewMarbles()

        let movableMarbleIds = movableMarbles.map(marble => {return String(marble.marbleId)})
        marbles = marbles.map(marble => {
            let marbleId = marble.getId()
            if(movableMarbleIds.includes(marbleId)) {
                if(marble.getHasPreviewMarble()) {
                    movableMarblesWithPreviewMarble.push(marble)
                    marble.setIsMovable(false)
                    return marble;
                }
                marble.setIsMovable(true)
                return marble;
            } 
            marble.setIsMovable(false)
            return marble;
        });

        let previewMarbles = this.getOnlyPreviewMarbles()
        previewMarbles = previewMarbles.map(previewMarble => {
            let movablePreviewMarble = movableMarblesWithPreviewMarble.find(movableOriginMarble => previewMarble.getIsCorrespondingPreviewMarble(movableOriginMarble.getId()))
            if(movablePreviewMarble) {
                previewMarble.setIsMovable(true)
                return previewMarble
            }       
            previewMarble.setIsMovable(false)
            return previewMarble
        })

        this.setState({marbles: marbles.concat(previewMarbles)});
    }

    updatePossibleTargetFields(possibleTargetFieldKeys) {
        let newFields = this.state.fields.map(field => {
            if(possibleTargetFieldKeys.includes(field.getKey())) {
                field.setIsPossibleTargetField(true)
                return field;
            } 
            field.setIsPossibleTargetField(false)
            return field;
        });

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
            let targetFieldKey = targetField.getKey()
            let marbleToPlay = this.getMarbleToPlay()

            this.addOrUpdatePreviewMarble(marbleToPlay, targetFieldKey)
            let sevenMove = {marbleId: marbleToPlay.getId(), targetFieldKey: targetFieldKey}

            this.setState({
                sevenMoves: [
                    ...this.state.sevenMoves,
                    sevenMove
                ],
            }, async () => {
                let remainingSevenMoves = await this.requestRemainingSevenMoves()
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
        try {
            const requestBody = JSON.stringify({
                sevenMoves: this.state.sevenMoves
            });
            const response = await api.post(`/game/${this.gameId}/remaining-seven-moves`, requestBody);

            return parseInt(response.data.remainingSevenMoves)
        } catch (error) {
            this.props.foregroundContext.showAlert(<ErrorMessage text={handleError(error)}/>, 5000)
        }
    }

    getMarbleToPlay() {
        let marbleToPlay = this.state.marbles.find(marble => marble.getIsSelected());
        if(marbleToPlay.getIsPreviewMarble()) {
            let originMarble = this.getOriginMarble(marbleToPlay.getId())
            return originMarble
        }
        return marbleToPlay
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

    getOriginMarble(previewMarbleId) {
        return this.state.marbles.find(marble => marble.getIsCorrespondingOriginMarble(previewMarbleId));
    }

    getPreviewMarble(originMarbleId) {
        return this.state.marbles.find(marble => marble.getIsCorrespondingPreviewMarble(originMarbleId));
    }

    getMarblesWithoutPreviewMarbles() {
        return this.state.marbles.filter(marble => !marble.getIsPreviewMarble())
    }

    getOnlyPreviewMarbles() {
        return this.state.marbles.filter(marble => marble.getIsPreviewMarble())
    }

    addOrUpdatePreviewMarble(marbleToPlay, targetFieldKey) {
        let originMarbleId = marbleToPlay.getId() 
        let previewMarble = this.getPreviewMarble(originMarbleId)

        // update
        if(previewMarble) {
            this.setState(prevState => {
                const marbles = prevState.marbles.map(marble => {
                    if (marble.getId() == previewMarble.getId()) {
                        marble.setFieldKey(targetFieldKey);
                    } 
                    return marble;
                });
                return {marbles: marbles};
            });
        } 
        // add
        else {
            previewMarble = createPreviewMarble(originMarbleId, targetFieldKey, marbleToPlay.getColor())
            let marbles = this.state.marbles.map(marble => {
                if(marble.getId() === originMarbleId) {
                    marble.setHasPreviewMarble(true)
                }
                return marble
            })
            marbles.push(previewMarble)
            this.setState({ marbles: marbles });
        }
    }

    resetAll() {
        this.resetMovableMarbles()
        this.resetSelectedMarble()
        this.resetPossibleTargetFields()
        this.resetSevenMoves()
    }

    resetMovableMarbles() {
        this.updateMovableMarbles([]);
    }

    resetSelectedMarble() {
        this.selectMarble(null);
    }

    resetPossibleTargetFields() {
        this.updatePossibleTargetFields([]);
    }

    resetSevenMoves() {
        let marblesWithoutPreviewMarbles = this.getMarblesWithoutPreviewMarbles()
        marblesWithoutPreviewMarbles.forEach(marble => {
            marble.setHasPreviewMarble(false)
            return marble
        })
        this.setState({ 
            sevenMoves: [], 
            remainingSevenMoves: 7,
            marbles: marblesWithoutPreviewMarbles
        })
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

export default withForegroundContext(Board);