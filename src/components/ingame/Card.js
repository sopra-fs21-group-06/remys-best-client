import React from "react";

class Card extends React.Component {

    render() {
        let {imgUrl, style, code} = this.props.card;
        
        let styles = {};
        if(style) {
            styles.left = style.left + "px";
            styles.bottom = style.bottom + "px";
            styles.transform = "rotate(" + style.rot + "deg)";
        } else {
            styles.left = "calc(50% - 100px)";
            styles.bottom = "-100px";
        }

        return (
            <img className="card" src={imgUrl} style={styles} onClick={this.props.onClickCard ? () => this.props.onClickCard(code) : null}/>
        );
    }
}

export default Card;