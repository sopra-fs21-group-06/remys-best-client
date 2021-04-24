import React from 'react';
import { withRouter } from 'react-router-dom';

class Facts extends React.Component {

  render() {
    return (
      <div className="facts">
        {this.props.facts.map((fact, index) => {
            return (
                <div className="fact" key={index}>
                  <p className="title">{fact.title}</p>
                  <p className="subtitle">{fact.subtitle}</p>
                </div>
            );
        })}
      </div>
    );
  }
}

export default withRouter(Facts);



/*


<div className="fact">
          <p className="title title-timer">{this.props.activePlayer} <span className="spacer"></span> <span className="timer">60</span></p>
          <p className="subtitle">Active Player</p>
        </div>



        */