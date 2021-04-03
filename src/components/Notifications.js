import React from 'react';
import { withRouter } from 'react-router-dom';

class Notifications extends React.Component {

  constructor() {
    super();
  }

  render() {
    return (
        <div className="notifications">
            <div className="container">
                <div className="bg"></div>
                <p className="message">
                    <span>Andrina</span> played <span>Diamonds Ace</span>
                </p>
            </div>

            <div className="container">
                <div className="bg"></div>
                <p className="message">
                    <span>Siddhant</span> played <span>Clubs Queen</span>
                </p>
            </div>

            <div className="container">
                <div className="bg"></div>
                <p className="message">
                    <span>You</span> received <span>Joker</span>
                </p>
            </div>

            <div className="container">
                <div className="bg"></div>
                <p className="message">
                    <span>You</span> sent <span>Heart King</span>
                </p>
            </div>

            <div className="container">
                <div className="bg"></div>
                <p className="message">
                    <span>Card exchange</span>
                </p>
            </div>
      </div>
    );
  }
}

export default withRouter(Notifications);