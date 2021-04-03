import React from 'react';
import { withRouter } from 'react-router-dom';
import Board from "../components/Board";
import Hand from "../components/Hand";
import RoundFacts from "../components/RoundFacts";
import Notifications from "../components/Notifications";

class GameScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      name: null,
      username: null
    };
  }

  render() {
    return (
      <div className="gameScreen">
        <RoundFacts roundNumber={1} activePlayer="You" nextRoundCardAmount={5} nextRoundBeginner="Andrina"/>
        <Notifications />
        <Board />
        <Hand />
      </div>
    );
  }
}

export default withRouter(GameScreen);