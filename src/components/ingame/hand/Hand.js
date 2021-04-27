import React from "react";
import Card from "./Card";

const CARD_WIDTH = 60;
const HAND_WIDTH = 300;
const CARD_HEIGHT = 139;
let a = -0.03;
let h = 5;
let k = 0.5;
let diff = 0.1;
let multi = 1.6;

class Hand extends React.Component {

    constructor() {
        super();
        this.state = {
            cards: []
        };
    }
    
    getrotation(xpos){
        let ypos = this.getypos(xpos);
        if(xpos < h){
            //left of the vertex
            let newx = xpos + diff;
            let newy = this.getypos(newx);

            let adjacent = newx - xpos;
            let opposite = newy - ypos;
            let angle = Math.atan(opposite / adjacent);
            angle *= 180;
            angle /= Math.PI;
            angle = 0 - angle;
            return angle * multi;
        }
        else if(xpos > h){
            //right of the vertex
            let newx = xpos - diff;
            let newy = this.getypos(newx);

            let adjacent = newx - xpos;
            let opposite = newy - ypos;
            let angle = Math.atan(opposite / adjacent);
            angle *= 180;
            angle /= Math.PI;
            angle = 0 - angle;
            return angle * multi;
        }
        else{
            //on the vertex
            return 0;
        }
    }

    getypos(xpos){
        let ypos = a * Math.pow((xpos - h), 2) + k;
        return ypos;
    }

    alignCards(cards) {
        for(let i = 0; i < cards.length; i++) {
            let card = cards[i];

            let count = cards.length;

            let left = CARD_WIDTH * i / 2;
            let totalwidth = count * (CARD_WIDTH / 2) + CARD_WIDTH / 2;
            if(totalwidth > HAND_WIDTH){
                //shift the cards to fit with minimal margin leftover
                let overflow = totalwidth - HAND_WIDTH;
                let shift = (overflow / (count - 1));
                left -= shift * i;
                totalwidth = HAND_WIDTH;
            }
            let leftdif = (HAND_WIDTH - totalwidth) / 2;
            
            left += leftdif;

            let center = left + CARD_WIDTH / 2;
            let xpos = center / HAND_WIDTH * 10;
            let ypos = this.getypos(xpos);
            let rot = this.getrotation(xpos);

            let bottom = (ypos / k) * CARD_HEIGHT / 4;
            let styles = {
                left: left,
                bottom: bottom,
                rot: rot
            };

            card.setStyle(styles)
        }

        return cards;
    }

    raiseCard(cardToRaise) {
        this.setState(prevState => {
            const cards = prevState.cards.map(card => {
                if (card == cardToRaise) {
                    if(card.getIsRaised()) {
                        card.setIsRaised(false);
                    } else {
                        card.setIsRaised(true);
                    }
                } else if(card.getIsRaised()) {
                    card.setIsRaised(false);
                }
                return card;
            });
            return {cards: cards};
        });
    }

    addCards(cardsToAdd) {
        for(let i = 0; i < cardsToAdd.length; i++) {

            // add card
            setTimeout(function() {  
                this.setState(prevState => {
                    let cardToAdd = cardsToAdd[i];
                    return {cards: [...prevState.cards, cardToAdd]};
                });
            }.bind(this), i * 300);

            // align cards
            setTimeout(function() {  
                let alignedCards = this.alignCards(this.state.cards);
                this.setState({cards: alignedCards});
            }.bind(this), i * 300 + 50); 
        }
    }

    removeRandomCard() {
        let cards = this.state.cards
        var randomCard = cards[Math.floor(Math.random() * cards.length)];
        this.removeCard(randomCard)
    }

    removeCard(cardToRemove) {
        // remove card
        let remainingCards = this.state.cards.filter(card => !card.getCode().includes(cardToRemove.getCode()));
        this.setState({cards: remainingCards});

        // align cards
        setTimeout(function() {  
            let alignedCards = this.alignCards(this.state.cards);
            this.setState({cards: alignedCards});
        }.bind(this), 50); 
    }
    
    render() {
        return (  
            <div className="hand-wrapper">
                <div className="hand">
                    {this.state.cards.map(card => {
                        return (
                            <Card 
                                key={card.getCode()} 
                                card={card}
                                onCardClick={this.props.onCardClick}
                                isActive={this.props.isActive}
                            />
                        );
                    })}
                </div>  
            </div>
        );
    }
}

export default Hand;