import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import Board from "../../components/ingame/Board";
import MyHand from "../../components/ingame/MyHand";
import Hand from "../../components/ingame/Hand";

import {getDomain, isProduction} from "../../helpers/getDomain";
import View from "../View";
import { viewLinks, gameEndModes } from "../../helpers/constants";
import RoundFacts from "../../components/ingame/RoundFacts";
import NotificationList from "../../components/ingame/NotificationList";
import { handModes } from "../../helpers/constants"

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import sockClient from "../../components/SockClient";
import sessionManager from "../../helpers/sessionManager";

const CARDS = [{
                code: "KH",
                imgUrl: "https://deckofcardsapi.com/static/img/KH.png"
            }, {
                code: "8C",
                imgUrl: "https://deckofcardsapi.com/static/img/8C.png"
            }, {
                code: "3H",
                imgUrl: "https://deckofcardsapi.com/static/img/3H.png"
            }, {
                code: "9D",
                imgUrl: "https://deckofcardsapi.com/static/img/9D.png"
            }, {
                code: "QH",
                imgUrl: "https://deckofcardsapi.com/static/img/QH.png"
            }
        ]

class Game extends React.Component {

  constructor() {
        super();
        this.connected = false;
        this.state = {
            cardsToPlay: []
        }
       
    }

    componentDidMount() {
      /*
        sessionManager.chat.clear();
        sockClient.onRegister(r => this.handleSocketRegister(r));
        sockClient.connectAndRegister(this.props.authToken);*/
       
    }

    playCard() {
      this.setState({
          cardsToPlay: [CARDS[Math.floor(Math.random() * 4)]]
      });
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
          <p onClick={() => this.playCard()}>play card</p>
            <RoundFacts roundNumber={1} activePlayer="You" nextRoundCardAmount={5} nextRoundBeginner="Andrina"/>
            <NotificationList />
            <Board size={500} cardsToPlay={this.state.cardsToPlay}/>
            

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