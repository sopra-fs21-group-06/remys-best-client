import React from "react";
import wood from '../../img/board.png';
import styled from 'styled-components';
import { lightenOrDarkenColor, computeFields } from '../../helpers/remysBestUtils';
import Marble from './Marble';
import Field from './Field';
import { colors } from '../../helpers/constants'
import { PopInOrSlideDown } from '../transitions/PopInOrSlideDown';
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
                fieldId: 0 + i,
                color: color
            });
        }
       
        this.setState({
            fields: fields,
            marbles: marbles
        })
    }

    playCards(playedCards, cardsToPlay) {
        for(let i = 0; i < cardsToPlay.length; i++) {
            playedCards.push(cardsToPlay[i]);
            console.log(playedCards)
        }
        return playedCards;
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
                                field={field}
                                color={marble.color}                               
                            />
                        );
                    })}
                </div>
                <TransitionGroup className="played-card-list">
                    {this.state.playedCards ? Object.keys(this.state.playedCards).reverse().map(key => {
                        return (
                            <PopInOrSlideDown key={key}>
                                <Card card={this.state.playedCards[key]}/>
                            </PopInOrSlideDown>
                        );
                    }) : null}
                </TransitionGroup>
            </div>
        );
    }
}

export default Board;