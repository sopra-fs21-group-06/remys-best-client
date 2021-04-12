import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import Board from "../../components/ingame/Board";
import MyHand from "../../components/ingame/hand/MyHand";
import Hand from "../../components/ingame/hand/Hand";
import dogCard from "../../img/dog-card.png"
import HandContainer from "../../components/ingame/hand/HandContainer";
import { createPlayer } from '../../helpers/modelUtils'
import View from "../View";
import { viewLinks, gameEndModes } from "../../helpers/constants";
import RoundFacts from "../../components/ingame/RoundFacts";
import NotificationList from "../../components/ingame/NotificationList";

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import sockClient from "../../components/SockClient";
import sessionManager from "../../helpers/sessionManager";

const MY_CARDS = [{
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

const OPP_CARDS = [{
        code: "1",
        imgUrl: dogCard
    }, {
        code: "2",
        imgUrl: dogCard
    }, {
        code: "3",
        imgUrl: dogCard
    }, {
        code: "4",
        imgUrl: dogCard
    }, {
        code: "5",
        imgUrl: dogCard
    }
]

class Game extends React.Component {

    constructor() {
      super();
      this.connected = false;
      this.state = {
        players: []
      }
      this.playCard = this.playCard.bind(this);
      this.myHandRef = React.createRef();
      this.leftHandRef = React.createRef();
      this.rightHandRef = React.createRef();
      this.partnerHandRef = React.createRef();
      this.boardRef = React.createRef();
    }

    
    componentDidMount() {

        /*
        sessionManager.chat.clear();
        sockClient.onRegister(r => this.handleSocketRegister(r));
        sockClient.connectAndRegister(this.props.authToken);*/

        let players = [];
        players.push(createPlayer("my player", this.myHandRef))
        players.push(createPlayer("username2", this.leftHandRef))
        players.push(createPlayer("username3", this.rightHandRef))
        players.push(createPlayer("username4", this.partnerHandRef))
        this.setState({players: players});

        this.newRound();
    }

    playCard(handRef, card, move) {
      handRef.current.removeCard(card)
      setTimeout(function(){ 
          this.boardRef.current.throwInCard(card);
      }.bind(this), 300);
      setTimeout(function(){ 
          this.boardRef.current.moveMarble()
      }.bind(this), 1300);
    }

    newRound() {
      this.myHandRef.current.addCards(MY_CARDS)
      this.leftHandRef.current.addCards(OPP_CARDS)
      this.rightHandRef.current.addCards(OPP_CARDS)
      this.partnerHandRef.current.addCards(OPP_CARDS)
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
                <NotificationList />
                <Board size={500} ref={this.boardRef} />
                <p onClick={() => this.playCard(this.rightHandRef, OPP_CARDS[Math.floor(Math.random() * 6)] )}>play from right opponent</p>
                <p onClick={() => this.playCard(this.leftHandRef, OPP_CARDS[Math.floor(Math.random() * 6)] )}>play from left opponent</p>
                <HandContainer position="my">
                  <MyHand handRef={this.myHandRef} playCard={this.playCard} isMyTurn={true}>
                    <Hand ref={this.myHandRef} />
                  </MyHand>
                </HandContainer>
                <HandContainer position="left">
                  <Hand ref={this.leftHandRef} />
                </HandContainer>
                <HandContainer position="right">
                  <Hand ref={this.rightHandRef} />
                </HandContainer>
                <HandContainer position="partner">
                  <Hand ref={this.partnerHandRef} />
                </HandContainer>
                <Link to={gameEnd}>Game aborted</Link>
            </main>
          </View>     
      );
    }
}

export default withRouter(Game);