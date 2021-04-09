import React from "react";
import { handModes } from "../../helpers/constants"
import Hand from "./Hand";
import RaisedCardMenu from "./RaisedCardMenu";
import RaisedCardOptions from "./RaisedCardOptions";

class MyHand extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            cardsToAdd: [],
            cardsToPlay: []
        };
        this.handleCardsUpdate = this.handleCardsUpdate.bind(this);
        this.handlePlayCards = this.handlePlayCards.bind(this);
        this.toggleCardRaise = this.toggleCardRaise.bind(this);
    }
    
    componentDidMount() {
        this.handleAddCards([{
                code: "KH",
                imgUrl: "https://deckofcardsapi.com/static/img/KH.png"
            }, {
                code: "8C",
                imgUrl: "https://deckofcardsapi.com/static/img/8C.png"
            }, {
                code: "3H",
                imgUrl: "https://deckofcardsapi.com/static/img/3H.png"
            }, {
                code: "9D",
                imgUrl: "https://deckofcardsapi.com/static/img/9D.png"
            }, {
                code: "QH",
                imgUrl: "https://deckofcardsapi.com/static/img/QH.png"
            }
        ]);
    }

    handleCardsUpdate(cards) {
        this.setState({cards: cards});
    }

    handlePlayCards(cardsToPlay) {
        this.setState({cardsToPlay: cardsToPlay});
    }

    handleAddCards(cardsToAdd) {
        this.setState({cardsToAdd: cardsToAdd});
    }

    toggleCardRaise(code) {
        this.setState(prevState => {
            const cards = prevState.cards.map(card => {
                let raisingDistance = 30;
                if (card.code == code) {
                    if(card.isRaised) {
                        card.style.bottom -= raisingDistance;
                        card.isRaised = false;
                    } else {
                        card.style.bottom += raisingDistance;
                        card.isRaised = true;
                    }
                } else if(card.isRaised) {
                    card.style.bottom -= raisingDistance;
                    card.isRaised = false;
                }
                return card;
            });
            return {cards: cards};
        });
        /*
        this.setState({cardsToAdd: [{
            code: "QD",
            imgUrl: "https://deckofcardsapi.com/static/img/QD.png"
        }]});*/
        /*
        this.setState({cardsToPlay: [{
            code: "8C",
            imgUrl: "https://deckofcardsapi.com/static/img/8C.png"
        }]});*/
    }

    render() {
        let raisedCard = this.state.cards.filter(card => {return card.isRaised})
        

        // TODO maybe rewrite passing obejcts and method to children via react context
        return (
            <div className="hand-container">
                <RaisedCardOptions raisedCard={raisedCard}/>
                <Hand 
                    cardsToAdd={this.state.cardsToAdd}
                    cardsToPlay={this.state.cardsToPlay}
                    cards={this.state.cards}
                    mode={handModes.MY_HAND}
                    handleCardsUpdate={this.handleCardsUpdate}
                    onClickCard={this.toggleCardRaise}
                />
                <RaisedCardMenu handlePlayCards={this.handlePlayCards} raisedCard={raisedCard}/>
            </div>
        );
    }
}

export default MyHand;



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