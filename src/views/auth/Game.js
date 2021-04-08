import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import Board from "../../components/ingame/Board";
import MyHand from "../../components/ingame/MyHand";
import Hand from "../../components/ingame/Hand";

import {getDomain, isProduction} from "../../helpers/getDomain";
import View from "../View";
import { viewLinks, gameEndModes } from "../../helpers/constants";
import RoundFacts from "../../components/ingame/RoundFacts";
import Notifications from "../../components/ingame/Notifications";
import { handModes } from "../../helpers/constants"

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import sockClient from "../../components/SockClient";
import sessionManager from "../../helpers/sessionManager";

class Game extends React.Component {

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
    let gameEnd = {
      pathname: '/game-end',
      state: { 
        mode: gameEndModes.ABORTED,
        usernameWhichHasLeft: "Andrina"
      }
    }

    return (
      <View className="game" isFooterInvisible={true} linkMode={viewLinks.BASIC}>
        <main>
            <RoundFacts roundNumber={1} activePlayer="You" nextRoundCardAmount={5} nextRoundBeginner="Andrina"/>
            <Notifications />
            <Board size={500}/>
            

            <MyHand />


            <Link to={gameEnd}>Game aborted</Link>
          </main>
      </View>
    );
  }
}

export default withRouter(Game);

/*
<Hand mode={handModes.LEFT_HAND}/>
            <Hand mode={handModes.RIGHT_HAND}/>
            <Hand mode={handModes.PARTNER_HAND}/>


-> left play menu
-> right play menu

            */