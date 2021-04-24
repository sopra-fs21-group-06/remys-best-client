import React from "react";
import wood from '../../img/board.png';
import styled from 'styled-components';
import { lightenOrDarkenColor, computeFields } from '../../helpers/remysBestUtils';
import Marble from './Marble';
import Field from './Field';
import { colors } from '../../helpers/constants'
import { ThrowIn } from '../transitions/ThrowIn';
import { TransitionGroup } from 'react-transition-group';
import Card from "./hand/Card";
import { createMarble } from '../../helpers/modelUtils'
import { GameContext } from '../../views/auth/Game';

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            size: this.props.size, // this.props.size? -> always width 100% make wrapper around each board with dynamic sizes? on resize recompute
            fields: [],
            marbles: [],
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
    }

    throwInCard(player, card) {
        this.setState(prevState => {
            let handRot = player.getHandRot();
            let randomCardRot = (Math.random() * 31) -15
            card.style = {
                rot: handRot + randomCardRot
            }
            return {playedCards: [...prevState.playedCards, card]};
      });
    }

    moveMarble() {
        //let id = Math.floor(Math.random() * 15) + 1;
        let id = 5;
        this.setState(prevState => {
            const marbles = prevState.marbles.map(marble => {
                if (marble.getId() == id) {
                    marble.setIsVisible(false);
                } 
                return marble;
            });
            return {marbles: marbles};
        });

        setTimeout(function(){ 
          this.setState(prevState => {
            const marbles = prevState.marbles.map(marble => {
              if (marble.getId() == id) {
                  marble.setIsVisible(true);
                  marble.setFieldId(marble.getFieldId() + 5);
              } 
              return marble;
            });
            return {marbles: marbles};
          });
        }.bind(this), 1000);
    }

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
        );
    }
}

export default Board;