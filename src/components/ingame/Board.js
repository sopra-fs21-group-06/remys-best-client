import React from "react";
import wood from '../../img/board.png';
import styled from 'styled-components';
<<<<<<< HEAD
import { lightenOrDarkenColor, computeFields } from '../../helpers/remysBestUtils';
=======
import { initMarbles, computeFields } from '../../helpers/remysBestUtils';
>>>>>>> dev
import Marble from './Marble';
import Field from './Field';
import { colors } from '../../helpers/constants'
import { ThrowIn } from '../transitions/ThrowIn';
import { TransitionGroup } from 'react-transition-group';
import Card from "./hand/Card";
import { createMarble } from '../../helpers/modelUtils'
import { GameContext } from '../../views/auth/Game';
<<<<<<< HEAD
=======
import WebsocketConsumer from '../websocket/WebsocketConsumer';
import { createChannel } from '../../helpers/modelUtils';
import sessionManager from "../../helpers/sessionManager";
>>>>>>> dev

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            size: this.props.size, // this.props.size? -> always width 100% make wrapper around each board with dynamic sizes? on resize recompute
            fields: [],
            marbles: [],
<<<<<<< HEAD
            playedCards: []
        };
    }

    /*
    componentDidUpdate(prevProps, prevState) {
        if (this.state.cardsToPlay !== prevState.cardsToPlay) {
            // after getDerivedStateFromProps() has changed the state
            let newPlayedCards = this.playCards(this.state.playedCards, this.state.cardsToPlay);
            
            this.setState({playedCards: newPlayedCards})
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.cardsToPlay !== prevState.cardsToPlay) {
            return {cardsToPlay: nextProps.cardsToPlay};
        }
        return null;
    }*/

    
    componentDidMount() {
        let fields = computeFields(this.state.size);
        let marbles = [];

        for (let i = 1; i <= 16; i++) {
            var color;

            if(i % 4 == 0) {
                color = colors.BLUE
            }
            else if(i % 4 == 1) {
                color = colors.GREEN
            }
            else if(i % 4 == 2) {
                color = colors.RED
            }
            else if(i % 4 == 3) {
                color = colors.YELLOW
            }
            
            marbles.push(createMarble(i, 0 + (3*i), color, false, true));
        }
       
        this.setState({
            fields: fields,
            marbles: marbles
        })
=======
            playedCards: [],
            bottomClass: "BLUE-bottom"
        };
        this.selectMarbleToPlay = this.selectMarbleToPlay.bind(this)
        this.selectTargetField = this.selectTargetField.bind(this)
        this.gameId = sessionManager.getGameId();
        this.channels = [
            createChannel(`/user/queue/game/${this.gameId}/marble-list`, (msg) => this.handleMarbleListMessage(msg))
        ]
    }

    componentDidMount() {       
        this.setState({
            fields: computeFields(this.state.size),
            marbles: initMarbles()
        })
    }

    handleMarbleListMessage(msg) {
        console.log("marble list received")
        console.log(msg.marbles)
        this.updateMovableMarbles(msg.marbles)
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
>>>>>>> dev
    }

    throwInCard(player, card) {
        this.setState(prevState => {
            let handRot = player.getHandRot();
            let randomCardRot = (Math.random() * 31) -15
<<<<<<< HEAD
            card.style = {
                rot: handRot + randomCardRot
            }
=======

            let style = card.getStyle();
            style.rot = handRot + randomCardRot
            card.setStyle(style)
            
>>>>>>> dev
            return {playedCards: [...prevState.playedCards, card]};
      });
    }

<<<<<<< HEAD
    moveMarble() {
        //let id = Math.floor(Math.random() * 15) + 1;
        let id = 5;
        this.setState(prevState => {
            const marbles = prevState.marbles.map(marble => {
                if (marble.getId() == id) {
=======
    moveMarble(marbleId, targetFieldKey) {
        // pick up
        this.setState(prevState => {
            const marbles = prevState.marbles.map(marble => {
                if (marble.getId() == marbleId) {
>>>>>>> dev
                    marble.setIsVisible(false);
                } 
                return marble;
            });
            return {marbles: marbles};
        });

<<<<<<< HEAD
        setTimeout(function(){ 
          this.setState(prevState => {
            const marbles = prevState.marbles.map(marble => {
              if (marble.getId() == id) {
                  marble.setIsVisible(true);
                  marble.setFieldId(marble.getFieldId() + 5);
=======
        // drop to new field
        setTimeout(function(){ 
          this.setState(prevState => {
            const marbles = prevState.marbles.map(marble => {
              if (marble.getId() == marbleId) {
                  marble.setFieldKey(targetFieldKey)
                  marble.setIsVisible(true);
>>>>>>> dev
              } 
              return marble;
            });
            return {marbles: marbles};
          });
        }.bind(this), 1000);
    }

<<<<<<< HEAD
    render() {
        return (
            <div className="board" style={{width: this.state.size, height: this.state.size}}>
                <img className="wood" src={wood} />
                <div className="fields">
                    {this.state.fields.map(field => {
                        return (
                            <Field 
                                key={field.getId()} 
                                field={field}
                            />
                        );
                    })}
                </div>
                <div className="marbles">
                    {this.state.marbles.map(marble => {
                        let field = this.state.fields.find(field => field.getId() === marble.getFieldId())
                        return (
                            <Marble 
                                key={marble.getId()}
                                marble={marble}
                                field={field}                       
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
=======
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
            <WebsocketConsumer channels={this.channels} >
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
            </WebsocketConsumer>
>>>>>>> dev
        );
    }
}

export default Board;