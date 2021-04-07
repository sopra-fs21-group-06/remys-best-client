import React from "react";
import dogCard from '../img/dog-card.png';
import avatar from '../img/avatar.png'
import Avatar from "../components/Avatar"

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
            imgUrls: [
                "https://deckofcardsapi.com/static/img/KH.png", 
            "https://deckofcardsapi.com/static/img/8C.png", 
            "https://deckofcardsapi.com/static/img/3H.png",
            "https://deckofcardsapi.com/static/img/9D.png",
            "https://deckofcardsapi.com/static/img/QH.png"]
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

    renderCards(isMyHand) {
        let cards = [];
        let imgUrls = this.state.imgUrls;

        for(let i = 0; i < imgUrls.length; i++) {
            let imgUrl = imgUrls[i];
            let count = imgUrls.length;

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
                left: left + "px",
                bottom: bottom + "px",
                transform: "rotate(" + rot + "deg)"
            };

            if(isMyHand) {
                cards.push(<img className="card" src={imgUrl} style={styles} />)
            } else {
                cards.push(<img className="card" src={dogCard} style={styles} />)
            }
        }
        return cards;
    }

    render() {
        return (
            <div>
                <div className="hand my-hand">
                    {this.renderCards(true)}
                </div>
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
                
            </div>
        );
    }
}

export default Hand;