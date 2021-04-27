import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import Board from "../../components/ingame/Board";
import MyHand from "../../components/ingame/hand/MyHand";
import Hand from "../../components/ingame/hand/Hand";
import dogCard from "../../img/dog-card.png"
import HandContainer from "../../components/ingame/hand/HandContainer";
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

      // rotate background and board
      let myPlayer = this.getMyPlayer()
      this.props.backgroundContextValue.dispatch({type: `${myPlayer.getColorName()}-bottom`})
      this.boardRef.current.setBottomClass(`${myPlayer.getColorName()}-bottom`)
    }

    handleFactsMessage(msg) {
      this.setState({ facts: msg.facts })
    } 

    handleNotificationMessage(msg) {
      let notification = msg;
      // inject key for rendering
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
      if(this.isMyPlayerName(msg.playerName)) {
        this.setState({ mode: roundModes.MY_TURN })
      }
      // TODO show current turn big message over whole screen
    }

    handlePlayedMessage(msg) {
      console.log("received played message")
      console.log(msg)

      let cardToPlay = this.getCardFromCode(msg.card.code)
      let player = this.state.players.find(player => player.getPlayerName() === msg.playerName)
      let marblesToMove = msg.marbles

      if(this.isMyPlayer(player)) {
        player.getHandRef().current.removeCard(cardToPlay)
      } else {
        player.getHandRef().current.removeRandomCard()
      }

      setTimeout(function(){ 
          this.boardRef.current.throwInCard(player, cardToPlay);
      }.bind(this), 500);

      setTimeout(function() { 
        // e.g. targetFieldKey = "16GREEN"
        let targetFieldKey = String(marblesToMove[0].targetFieldId) + String(marblesToMove[0].targetFieldColor)
        this.boardRef.current.moveMarble(marblesToMove[0].marbleId, targetFieldKey)
      }.bind(this), 1500);

      // TODO how to process marbles sent home??
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

    getMyPlayerName() {
      return localStorage.getItem("username")
    }

    isMyPlayerName(playerName) {
      return this.getMyPlayerName() === playerName
    }

    isMyPlayer(player) {
      return this.isMyPlayerName(player.getPlayerName())
    }

    getMyPlayer() {
      return this.state.players.find(player => this.isMyPlayerName(player.getPlayerName()))
    }

    getMyHandRef() {
      return this.getHandRef(this.getMyPlayerName())
    }

    getHandRef(playerName) {
      let player = this.state.players.find(player => player.getPlayerName() === playerName)
      return player.getHandRef()
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
      this.context.sockClient.send(`/app/game/${this.gameId}/play`, {
        code: cardToPlay.getCode(), 
        moveName: moveNameToPlay, 
        marbles: marbles
      });
    }

    reset() {
      this.myHandContainerRef.current.resetRaiseCard();
      this.myHandContainerRef.current.resetMoves();
      this.myHandContainerRef.current.resetSelectedMoveName();
      this.boardRef.current.resetMovableMarbles()
      this.boardRef.current.resetSelectedMarble()
    }

    sendReadyMessage() {
     this.context.sockClient.send(`/app/game/${this.gameId}/ready`, {});
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
        <WebsocketConsumer channels={this.channels} connectionCallback={() => this.sendReadyMessage()}>
          <View className="game" withFooterHidden withDogImgHidden linkMode={viewLinks.BASIC}>
            <main>
                <Facts facts={this.state.facts}/>
                <Notifications notifications={this.state.notifications} />
                <Board size={500} ref={this.boardRef} myHandContainerRef={this.myHandContainerRef}/>
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