import React from "react";

class Card extends React.Component {

    render() {
<<<<<<< HEAD
        let {card} = this.props;

        let imgUrl = card.getImgUrl();
        let isRaised = card.getIsRaised();
        let style = card.getStyle();
=======
        let {imgUrl, style, code, isRaised} = this.props.card;
>>>>>>> 1d7b81c (websocket basic implementation, first test until game screen (#111))
        
        let styles = {};
        if(style) {
            styles.left = style.left ? style.left + "px" : '';
            styles.bottom = style.bottom ? style.bottom + "px" : '';
            styles.transform = style.rot ? "rotate(" + style.rot + "deg)" : '';
        }


        if(isRaised) {
            let raisingDistance = 30;
            styles.bottom = (style.bottom + raisingDistance) + "px";
        } 

        return (
            <div className="card-wrapper">
                <img 
<<<<<<< HEAD
                    className={"card " + (this.props.isActive ? "raisable" : '')} 
                    src={imgUrl} 
                    style={styles} 
                    onClick={this.props.isActive ? () => this.props.onCardClick(this.props.card) : null}
=======
                    className={"card " + (this.props.isMyTurn ? "raisable" : '')} 
                    src={imgUrl} 
                    style={styles} 
                    onClick={this.props.onCardClick ? () => this.props.onCardClick(this.props.card) : null}
>>>>>>> 1d7b81c (websocket basic implementation, first test until game screen (#111))
                />
            </div>
        );
    }
}

export default Card;