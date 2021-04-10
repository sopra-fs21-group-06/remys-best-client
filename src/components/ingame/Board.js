import React from "react";
import wood from '../../img/board.png';
import styled from 'styled-components';
import { lightenOrDarkenColor, computeFields } from '../../helpers/remysBestUtils';
import Marble from './Marble';
import Field from './Field';
import { colors } from '../../helpers/constants'
import { ThrowIn } from '../transitions/ThrowIn';
import { TransitionGroup } from 'react-transition-group';
import Card from "./Card";

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            size: this.props.size, // this.props.size? -> always width 100% make wrapper around each board with dynamic sizes? on resize recompute
            fields: [],
            marbles: [],
            playedCards: [],
            cardsToPlay: []
        };
    }

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
    }

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
            
            marbles.push({
                id: i,
                fieldId: 0 + (3*i),
                color: color,
                isMovable: false,
                isVisible: true
            });
        }
       
        this.setState({
            fields: fields,
            marbles: marbles
        })
    }

    playCards(playedCards, cardsToPlay) {
        for(let i = 0; i < cardsToPlay.length; i++) {
            let card = cardsToPlay[i];
            card.style = {
                rot: (Math.random() * 31) -15
            }
            playedCards.push(cardsToPlay[i]);
        }

        setTimeout(function(){ 
            this.updateMarble()
        }.bind(this), 1000);


        return playedCards;
    }

    updateMarble() {
        let id = Math.floor(Math.random() * 15) + 1;
        id = 5;
        this.setState(prevState => {
            const marbles = prevState.marbles.map(marble => {
                if (marble.id == id) {
                    marble.isVisible = false;
                } 
                return marble;
            });
            return {marbles: marbles};
        });

        
        setTimeout(function(){ 
            this.setState(prevState => {
            const marbles = prevState.marbles.map(marble => {
                if (marble.id == id) {
                    marble.isVisible = true;
                    marble.fieldId = marble.fieldId + 5
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
                                key={field.id} 
                                field={field}
                            />
                        );
                    })}
                </div>
                <div className="marbles">
                    {this.state.marbles.map(marble => {
                        let field = this.state.fields.find(field => field.id === marble.fieldId)
                        return (
                            <Marble 
                                key={marble.id}
                                marble={marble}
                                field={field}                       
                            />
                        );
                    })}
                </div>
                <p onClick={() => this.updateMarble()}>UpdateMarble</p>
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