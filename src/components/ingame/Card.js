import React from "react";

class Card extends React.Component {

    render() {
        let {imgUrl, style, code} = this.props.card;
        
        let styles = {};
        if(style) {
            styles.left = style.left ? style.left + "px" : '';
            styles.bottom = style.bottom ? style.bottom + "px" : '';
            styles.transform = style.rot ? "rotate(" + style.rot + "deg)" : '';
        }

        return (
            <div className="card-wrapper">
                <img 
                    className={"card " + (this.props.isRaisable ? "raisable" : '')} 
                    src={imgUrl} 
                    style={styles} 
                    onClick={this.props.onClickCard ? () => this.props.onClickCard(code) : null}
                />
            </div>
        );
    }
}

export default Card;