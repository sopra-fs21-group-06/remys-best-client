import React from 'react';
import { cardImages } from '../helpers/constants'
import { createCard } from '../helpers/modelUtils'

class CardOverview extends React.Component {

    onClickCard(cardCode) {
        let chosenCard = createCard(cardCode, cardImages[cardCode])
        this.props.handleJokerCardChosen(this.props.jokerCard, chosenCard)
    }

    render() {
        let hearCardImages = Object.keys(cardImages).filter(cardImageKey => cardImageKey.slice(1, 2) === "H")

        return (
            <div className="card-overview">
                <div className="card-container">
                    {hearCardImages.map(cardCode => {
                        return (
                            <img className="card" key={cardCode} onClick={() => this.onClickCard(cardCode)} src={cardImages[cardCode]} alt={cardCode} />
                        )
                    })}
                </div>
            </div>
        );
    }
}

export default CardOverview;