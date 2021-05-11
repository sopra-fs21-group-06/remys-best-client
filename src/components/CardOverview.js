import React from 'react';

class CardOverview extends React.Component {

    render() {
        return (
            <div className="overlay">
                {this.props.component}
            </div>
        );
    }
}

export default CardOverview;