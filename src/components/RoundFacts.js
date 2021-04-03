import React from 'react';
import { withRouter } from 'react-router-dom';

class RoundStats extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
      <div className="facts">
        <div className="fact">
          <p className="title">{this.props.roundNumber}</p>
          <p className="subtitle">Round</p>
        </div>
        <div className="fact">
          <p className="title">{this.props.activePlayer}</p>
          <p className="subtitle">Active Player</p>
        </div>
        <div className="fact">
          <p className="title">{this.props.nextRoundCardAmount}</p>
          <p className="subtitle">Next Round Card Amount</p>
        </div>
        <div className="fact">
          <p className="title">{this.props.nextRoundBeginner}</p>
          <p className="subtitle">Next Round Beginner</p>
        </div>
      </div>
    );
  }
}

export default withRouter(RoundStats);