import React from "react";
import wood from '../../img/board.png';
import styled from 'styled-components';
import { initMarbles, computeFields } from '../../helpers/remysBestUtils';
import Marble from './Marble';
import Field from './Field';
import { colors } from '../../helpers/constants'
import { ThrowIn } from '../transitions/ThrowIn';
import { TransitionGroup } from 'react-transition-group';
import Card from "./hand/Card";
import { createMarble } from '../../helpers/modelUtils'
import { GameContext } from '../../views/auth/Game';
import WebsocketConsumer from '../websocket/WebsocketConsumer';
import { createChannel } from '../../helpers/modelUtils';
import sessionManager from "../../helpers/sessionManager";

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
            newMarbles = this.state.marbles;
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

    moveMarble(marbleId, targetFieldKey) {
        this.setState(prevState => {
            const marbles = prevState.marbles.map(marble => {
                if (marble.getId() == marbleId) {
                    marble.setIsVisible(false);
                } 
                return marble;
            });
            return {marbles: marbles};
        });

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
        
        this.props.myHandContainerRef.current.setIsMarbleChosen(marbleToSelect);
    }

    selectMarbleToPlay(marbleToPlay) {
        this.resetMovableMarbles()
        this.selectMarble(marbleToPlay)   
    }

    getMarbleToPlay() {
        return this.state.marbles.find(marble => marble.getIsSelected());
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
        );
    }
}

export default Board;