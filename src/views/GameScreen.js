import React from 'react';
import { withRouter } from 'react-router-dom';
import Board from "../components/Board";
import Hand from "../components/Hand";
import NavigationLink from "../components/NavigationLink";
import {getDomain, isProduction} from "../helpers/getDomain";

import RoundFacts from "../components/RoundFacts";
import Notifications from "../components/Notifications";

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import sockClient from "../components/SockClient";
import sessionManager from "../helpers/sessionManager";

class GameScreen extends React.Component {

  constructor() {
        super();
        this.connected = false;
       
    }

    componentDidMount() {
        sessionManager.chat.clear();

        sockClient.onRegister(r => this.handleSocketRegister(r));
       
sockClient.connectAndRegister(this.props.authToken);
       
    }

  render() {
    return (
      <div className="gameScreen">
        <button onClick={() => this.connect()}>connect</button>
        <button onClick={() => this.disconnect()}>disconnet</button>
        <button onClick={() => this.sendName()}>send</button>
        <NavigationLink position="header" name="Help" to="/home" />
        <RoundFacts roundNumber={1} activePlayer="You" nextRoundCardAmount={5} nextRoundBeginner="Andrina"/>
        <Notifications />
        <Board />
        <Hand />
        <NavigationLink position="footer" name="Leave" to="/leave" />
      </div>
    );
  }
}

export default withRouter(GameScreen);