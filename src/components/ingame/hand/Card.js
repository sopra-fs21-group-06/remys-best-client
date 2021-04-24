import React from "react";

class Card extends React.Component {

    render() {
        let {imgUrl, style, code, isRaised} = this.props.card;
        
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
                    className={"card " + (this.props.isMyTurn ? "raisable" : '')} 
                    src={this.props.card.imgUrl} 
                    style={styles} 
                    onClick={this.props.onCardClick ? () => this.props.onCardClick(this.props.card) : null}
                />
            </div>
        );
    }
}

export default Card;