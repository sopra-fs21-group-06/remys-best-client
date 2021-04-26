import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import Board from "../../components/ingame/Board";
import MyHand from "../../components/ingame/hand/MyHand";
import Hand from "../../components/ingame/hand/Hand";
import dogCard from "../../img/dog-card.png"
import HandContainer from "../../components/ingame/hand/HandContainer";
import { createPlayer } from '../../helpers/modelUtils'
import View from "../View";
import { viewLinks, gameEndModes, cardImages } from "../../helpers/constants";
import Facts from "../../components/ingame/Facts";
import Notifications from "../../components/ingame/Notifications";
import WebsocketConsumer from '../../components/websocket/WebsocketConsumer';
import { createChannel, createCard } from '../../helpers/modelUtils';
import { generateUUID, assignPlayersToColors } from '../../helpers/remysBestUtils';
import sessionManager from "../../helpers/sessionManager";
import { WebsocketContext } from '../../components/websocket/WebsocketProvider';
import { roundModes } from '../../helpers/constants';
import { withBackgroundContext } from '../../components/Background';

class Game extends React.Component {

    static contextType = WebsocketContext;

    constructor(props) {
      super(props);

      this.boardRef = React.createRef();
      this.myHandContainerRef = React.createRef();
      this.myHandRef = React.createRef();
      this.rightHandRef = React.createRef();
      this.leftHandRef = React.createRef();
      this.partnerHandRef = React.createRef();

      this.state = {
        players: assignPlayersToColors(this.props.location.state.players, this.myHandRef, this.rightHandRef, this.partnerHandRef, this.leftHandRef),
        facts: [],
        notifications: [],
        allCards: [],
        mode: roundModes.IDLE,
        moveNameToPlay: null,
        marblesToPlay: []
      }
      this.play = this.play.bind(this);
      this.reset = this.reset.bind(this);
      this.gameId = sessionManager.getGameId();
      this.channels = [
        createChannel(`/topic/game/${this.gameId}/facts`, (msg) => this.handleFactsMessage(msg)),
        createChannel(`/topic/game/${this.gameId}/notification`, (msg) => this.handleNotificationMessage(msg)),
        createChannel(`/topic/game/${this.gameId}/turn`, (msg) => this.handleTurnChangedMessage(msg)),
        createChannel(`/topic/game/${this.gameId}/played`, (msg) => this.handlePlayedMessage(msg)),
        createChannel(`/user/queue/game/${this.gameId}/cards`, (msg) => this.handleCardsReceivedMessage(msg))
      ]
    }

    componentDidMount() {
      let allCards = Object.keys(cardImages).map(cardCode => {
        // TODO load img in memory, cache images
        return createCard(cardCode, cardImages[cardCode])
      })
      this.setState({allCards: allCards});


      // set background
      let foo = this.props.location.state.players;
      let myPlayer = foo.find(player => player.playerName === localStorage.getItem("username"))
      this.props.backgroundContextValue.dispatch({type: `${myPlayer.color}-bottom`})

      // rotate board
      this.boardRef.current.setBottomClass(`${myPlayer.color}-bottom`)
    }

    getHandRef(playerName) {
      let player = this.state.players.find(player => player.getPlayerName() === playerName)
      return player.getHandRef()
    }

    getMyHandRef() {
      return this.getHandRef(localStorage.getItem("username"))
    }

    getCardFromCode(code) {
      return this.state.allCards.find(card => card.getCode() === code)
    }
    
    generateOtherCards(cardAmount) {
      let otherCards = [];
      for(let i = 0; i < cardAmount; i++) {
        otherCards.push(createCard(generateUUID(), dogCard))
      }
      return otherCards;
    }

    play() {
      let cardToPlay = this.myHandContainerRef.current.getCardToPlay();
      let moveNameToPlay = this.myHandContainerRef.current.getMoveNameToPlay();
      let marbleToPlay = this.boardRef.current.getMarbleToPlay();

      let marbles = [{id: marbleToPlay.getId()}];
     
      this.context.sockClient.send(`/app/game/${this.gameId}/play`, {code: cardToPlay.getCode(), moveName: moveNameToPlay, marbles: marbles});
    }

    reset() {
      this.myHandContainerRef.current.resetRaiseCard();
      this.myHandContainerRef.current.resetMoves();
      this.myHandContainerRef.current.resetSelectedMoveName();
      this.boardRef.current.resetMovableMarbles()
      this.boardRef.current.resetSelectedMarble()
    }

    sendReady() {
     this.context.sockClient.send(`/app/game/${this.gameId}/ready`, {});
    }

    handleFactsMessage(msg) {
      this.setState({ facts: msg.facts })
    } 

    handleNotificationMessage(msg) {
      let notification = msg;
      notification.key = +new Date()

      this.setState({
          notifications: [
              ...this.state.notifications,
              notification
          ],
      });

      if(notification.action === "Card Exchange") {
        this.setState({ mode: roundModes.EXCHANGE })
      }
    }

    handleTurnChangedMessage(msg) {
      if(localStorage.getItem("username") === msg.playerName) {
        this.setState({ mode: roundModes.MY_TURN })
      }
      // TODO show current turn big message over whole screen
    }

    handlePlayedMessage(msg) {
      console.log("received played message")
      console.log(msg)

      let cardCodeToPlay = msg.card.code
      let playerName = msg.playerName
      let marblesToMove = msg.marbles
      let player = this.state.players.find(player => player.getPlayerName() === playerName)

      setTimeout(function(){ 
          this.boardRef.current.throwInCard(player, this.getCardFromCode(cardCodeToPlay));
      }.bind(this), 300);
      setTimeout(function() { 
          this.boardRef.current.moveMarble(marblesToMove[0].marbleId, marblesToMove[0].targetFieldId)
      }.bind(this), 1300);
    }

    handleCardsReceivedMessage(msg) {
      let myCards = msg.cards.map(card => {
        return this.getCardFromCode(card.code)
      })
      
      this.getMyHandRef().current.addCards(myCards)

      // TODO how to decide if it's the card from my partner?
      if(myCards.length > 1) {
        let cardAmount = myCards.length;
        this.leftHandRef.current.addCards(this.generateOtherCards(cardAmount))
        this.rightHandRef.current.addCards(this.generateOtherCards(cardAmount))
        this.partnerHandRef.current.addCards(this.generateOtherCards(cardAmount))
      } else {
        this.setState({ mode: roundModes.IDLE})
      }
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
        <WebsocketConsumer channels={this.channels} connectionCallback={() => this.sendReady()}>
          <View className="game" withFooterHidden withDogImgHidden linkMode={viewLinks.BASIC}>
            <main>
                <Facts facts={this.state.facts}/>
                <Notifications notifications={this.state.notifications} />
                <Board size={500} ref={this.boardRef} myHandContainerRef={this.myHandContainerRef}/>

                {/*
                <p onClick={() => this.playCard(this.state.players[1], OPP_CARDS[Math.floor(Math.random() * 6)], null )}>play from left opponent</p>
                <p onClick={() => this.playCard(this.state.players[2], OPP_CARDS[Math.floor(Math.random() * 6)], null )}>play from right opponent</p>
                */}

                <HandContainer position="my">
                  <MyHand ref={this.myHandContainerRef} myHandRef={this.myHandRef} mode={this.state.mode} play={this.play} reset={this.reset}>
                    <Hand ref={this.myHandRef} isActive={this.state.mode !== roundModes.IDLE}/>
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
        </WebsocketConsumer>
      );
    }
}

export default withRouter(withBackgroundContext(Game));