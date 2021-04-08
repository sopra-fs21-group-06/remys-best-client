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
    }

    componentDidMount() {
        this.addCards(this.props.cardsToAdd);        
    }

    componentDidUpdate(prevProps) {
        if (this.props.cardsToAdd !== prevProps.cardsToAdd) {
            this.addCards(this.props.cardsToAdd);        
        }
        if (this.props.cardsToPlay !== prevProps.cardsToPlay) {
            console.log("cards to play updated")
            this.playCards(this.props.cards, this.props.cardsToPlay);        
        }
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

    addCards(cardsToAdd) {
        for(let i = 0; i < cardsToAdd.length; i++) {
            setTimeout(function() {    
                this.props.handleCardsUpdate([...this.props.cards, {
                    code: cardsToAdd[i].code, 
                    imgUrl: cardsToAdd[i].imgUrl,
                    isRaised: cardsToAdd[i].isRaised
                }])
            }.bind(this), (i+1) * 300); 
            setTimeout(function() {    
                let alignedCards = this.alignCards(this.props.cards);
                this.props.handleCardsUpdate(alignedCards)
            }.bind(this), (i+1) * 350); 
        }
    }

    playCards(cards, cardsToPlay) {
        let remainingCards = cards;
        for(let i = 0; i < cardsToPlay.length; i++) {
            remainingCards = cards.filter(card => !card.code.includes(cardsToPlay[i].code));
        }
        let alignedCards = this.alignCards(remainingCards);
        this.props.handleCardsUpdate(alignedCards)
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

            card.style = styles;
        }

        return cards;
    }

    render() {
        return (  
            <div className="hand-wrapper">
                <div className={"hand " + this.props.mode}>
                    {this.props.cards.map(card => {
                        return (
                            <Card 
                                key={card.code} 
                                card={card}
                                onClickCard={this.props.onClickCard}
                            />
                        );
                    })}
                </div>
            </div>  
        );
    }
}

export default Hand;



/*

<div className="hand left-hand">
                    <div className="cards"> {this.renderCards(false)}</div>
                    <Avatar size="80" color="yellow" img={avatar} />
                </div>
                <div className="hand right-hand">
                    {this.renderCards(false)}
                    <Avatar size="80" color="green" img={avatar} />
                </div>
                <div className="hand partner-hand">
                    {this.renderCards(false)}
                </div>


                */