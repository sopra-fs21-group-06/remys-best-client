import React from "react";

class Card extends React.Component { 

    render() {
        let {card} = this.props;

        let imgUrl = card.getImgUrl();
        let isRaised = card.getIsRaised();
        let isPlayable = card.getIsPlayable();
        let style = card.getStyle();
        
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
            <div className={"card-wrapper"}>
                <img 
                    className={"card " + (this.props.isActive ? "raisable " : '') + (isPlayable ? "playable " : '')} 
                    src={imgUrl} 
                    style={styles} 
                    onClick={this.props.isActive ? () => this.props.onCardClick(this.props.card) : null}
                />
            </div>
        );
    }
}

export default Card;