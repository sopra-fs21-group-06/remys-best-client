import React from 'react';
import { withRouter } from 'react-router-dom';
import Board from "../../components/Board";
import Hand from "../../components/Hand";
import {getDomain, isProduction} from "../../helpers/getDomain";
import View from "../View";
import { viewLinks } from "../../helpers/constants";

import RoundFacts from "../../components/RoundFacts";
import Notifications from "../../components/Notifications";

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import sockClient from "../../components/SockClient";
import sessionManager from "../../helpers/sessionManager";

class GameScreen extends React.Component {

  constructor() {
        super();
        this.connected = false;
       
    }

    componentDidMount() {
      /*
        sessionManager.chat.clear();

        sockClient.onRegister(r => this.handleSocketRegister(r));
       
        sockClient.connectAndRegister(this.props.authToken);*/
       
    }

  render() {
    return (
      <View className="game" isFooterInvisible={true} linkMode={viewLinks.BASIC}>
        <main>
            <RoundFacts roundNumber={1} activePlayer="You" nextRoundCardAmount={5} nextRoundBeginner="Andrina"/>
            <Notifications />
            <Board />
            <Hand />
          </main>
      </View>
    );
  }
}

export default withRouter(GameScreen);