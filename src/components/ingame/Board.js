import React from "react";
import wood from '../../img/board.png';
import { initMarbles, computeFields } from '../../helpers/remysBestUtils';
import Marble from './Marble';
import Field from './Field';
import { ThrowIn } from '../transitions/ThrowIn';
import { TransitionGroup } from 'react-transition-group';
import Card from "./hand/Card";

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            size: this.props.size, // this.props.size? -> always width 100% make wrapper around each board with dynamic sizes? on resize recompute
            fields: [],
            marbles: [],
            playedCards: [],
            bottomClass: "BLUE-bottom"
        };
        this.selectMarbleToPlay = this.selectMarbleToPlay.bind(this)
        this.selectTargetField = this.selectTargetField.bind(this)
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

    // TODO call with data received from backend, in game view component
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

    selectMarble(marbleToSelect) {
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
        });     
    }

    async selectMarbleToPlay(marbleToPlay) {
        this.resetMovableMarbles()
        this.selectMarble(marbleToPlay)

        // TODO wait for it
        await new Promise(resolve => setTimeout(resolve, 500));
        this.props.requestPossibleTargetFields()
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

        this.props.myHandContainerRef.current.setIsMarbleChosen(true);
    }

    getMarbleToPlay() {
        return this.state.marbles.find(marble => marble.getIsSelected());
    }

    getTargetField() {
        return this.state.fields.find(field => field.getIsTargetField());
    }

    resetAll() {
        this.resetMovableMarbles()
        this.resetSelectedMarble()
    }

    resetMovableMarbles() {
        this.updateMovableMarbles([]);
    }

    resetSelectedMarble() {
        this.selectMarble(null);
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