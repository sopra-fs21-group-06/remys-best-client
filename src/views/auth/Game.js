import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import Board from "../../components/ingame/Board";
import MyHand from "../../components/ingame/hand/MyHand";
import Hand from "../../components/ingame/hand/Hand";
import dogCard from "../../img/dog-card.png"
import HandContainer from "../../components/ingame/hand/HandContainer";
import View from "../View";
import { cardImages, gameEndModes, roundModes, viewLinks } from "../../helpers/constants";
import Facts from "../../components/ingame/Facts";
import Notifications from "../../components/ingame/Notifications";
import WebsocketConsumer from '../../components/context/WebsocketConsumer';
import { createCard, createChannel } from '../../helpers/modelUtils';
import {kennelFieldIds} from '../../helpers/constants';
import { assignPlayersToColors, generateUUID } from '../../helpers/remysBestUtils';
import sessionManager from "../../helpers/sessionManager";
import { withWebsocketContext } from '../../components/context/WebsocketProvider';
import { withBackgroundContext } from '../../components/context/BackgroundProvider';
import { withForegroundContext } from '../../components/context/ForegroundProvider';
import { api } from '../../helpers/api';

class Game extends React.Component {

    constructor(props) {
      super(props);

      this.boardRef = React.createRef();
      this.myHandContainerRef = React.createRef();
      this.myHandRef = React.createRef();
      this.rightHandRef = React.createRef();
      this.leftHandRef = React.createRef();
      this.partnerHandRef = React.createRef();

      this.state = {
        facts: [],
        notifications: [],
        allCards: [],
        mode: roundModes.IDLE,
        players: assignPlayersToColors(this.props.location.state.players, this.myHandRef, this.rightHandRef, this.partnerHandRef, this.leftHandRef),
        currentTurnPlayerName: null,
        moveNameToPlay: null,
        marblesToPlay: [],
      }

      this.requestMoves = this.requestMoves.bind(this);
      this.requestPossibleMarbles = this.requestPossibleMarbles.bind(this);
      this.play = this.play.bind(this);
      this.reset = this.reset.bind(this);
      this.requestPossibleTargetFields = this.requestPossibleTargetFields.bind(this)
      this.throwAway = this.throwAway.bind(this)
      this.updateMode = this.updateMode.bind(this)

      this.gameId = sessionManager.getGameId();
      this.channels = [
        createChannel(`/topic/game/${this.gameId}/facts`, (msg) => this.handleFactsMessage(msg)),
        createChannel(`/topic/game/${this.gameId}/notification`, (msg) => this.handleNotificationMessage(msg)),
        createChannel(`/topic/game/${this.gameId}/turn`, (msg) => this.handleTurnChangedMessage(msg)),
        createChannel(`/topic/game/${this.gameId}/throwaway`, (msg) => this.handleThrowAwayMessage(msg)),
        createChannel(`/topic/game/${this.gameId}/played`, (msg) => this.handlePlayedMessage(msg)),
        createChannel(`/user/queue/game/${this.gameId}/cards`, (msg) => this.handleCardsReceivedMessage(msg)),
        createChannel(`/topic/game/${this.gameId}/game-end`, (msg) => this.handlePlayerDisconnection(msg))
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
      this.props.backgroundContext.dispatch({type: `${myPlayer.getColorName()}-bottom`})
      this.boardRef.current.setBottomClass(`${myPlayer.getColorName()}-bottom`)
    }

    handleFactsMessage(msg) {
      this.setState({ facts: msg.facts })
    } 

    handleNotificationMessage(msg) {
      let notification = msg;
      // inject key for rendering
      notification.key = +new Date()

      let notifications = this.state.notifications
      notifications.push(notification)
      if(notifications.length > 5) {
        // remove first element (oldest one)
        notifications.shift()
      }

      this.setState({ notifications: notifications });

      if(notification.action === "Card Exchange") {
        this.setState({ mode: roundModes.EXCHANGE })
      }
    }

    handleTurnChangedMessage(msg) {
      let playerName = msg.playerName
      let mode
      if(this.isMyPlayerName(playerName)) {
        mode = roundModes.MY_TURN
        playerName = "your"
      } else {
        mode = roundModes.IDLE
        playerName += "'s"
      }

      if(this.state.currentTurnPlayerName === null) {
        this.props.foregroundContext.displayCurrentTurnMessage(playerName)
      }

      this.setState({ 
        mode: mode,
        currentTurnPlayerName: playerName
      })
    }

    handleThrowAwayMessage(msg) {
      let cardsToThrowAway = msg.cardCodes.map(cardCode => {
        return this.getCardFromCode(cardCode)
      }) 
      let player = this.state.players.find(player => player.getPlayerName() === msg.playerName)

      player.getHandRef().current.removeAllCards()

      player.getHandRef().current.alignCards(cardsToThrowAway)
      setTimeout(function(){ 
          this.boardRef.current.throwInAllCards(player, cardsToThrowAway);
      }.bind(this), 500);
    }

    handlePlayedMessage(msg) {
      let cardToPlay = this.getCardFromCode(msg.card.code)
      let player = this.state.players.find(player => player.getPlayerName() === msg.playerName)
      let marbles = msg.marbles

      let marblesToSendHome = marbles.filter(marbleIdAndFieldKey => { 
        let targetFieldId = parseInt(marbleIdAndFieldKey.targetFieldKey.replace(/\D/g, ""))  
        return targetFieldId >= kennelFieldIds[0];
      });

      let marblesToMove = marbles.filter(marbleIdAndFieldKey => !marblesToSendHome.includes(marbleIdAndFieldKey.targetFieldKey))

      if(this.isMyPlayer(player)) {
        player.getHandRef().current.removeCard(cardToPlay)
      } else {
        player.getHandRef().current.removeRandomCard()
      }

      setTimeout(function(){ 
          this.boardRef.current.throwInCard(player, cardToPlay);
      }.bind(this), 500);

      setTimeout(function() { 
        marblesToMove.forEach(marbleToMove => {
          this.boardRef.current.moveMarble(marbleToMove.marbleId, marbleToMove.targetFieldKey);
        })
      }.bind(this), 1500);

      if(marblesToSendHome !== undefined) {
        setTimeout(function() { 
          marblesToSendHome.forEach(marbleToSendHome => {
            this.boardRef.current.moveMarble(marbleToSendHome.marbleId, marbleToSendHome.targetFieldKey);
          })
        }.bind(this), 2500);

        setTimeout(function() { 
          this.props.foregroundContext.displayCurrentTurnMessage(this.state.currentTurnPlayerName)
        }.bind(this), 3500);

      } else {
        setTimeout(function() { 
          this.props.foregroundContext.displayCurrentTurnMessage(this.state.currentTurnPlayerName)
        }.bind(this), 2500);
      }
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
        // card from partner received
        this.setState({ mode: roundModes.IDLE})
      }
    }

    handlePlayerDisconnection(msg) {
      if(msg.aborted!=null) {
        this.props.history.push({pathname: '/game-end', state: {usernameWhichHasLeft: msg.aborted, mode:'aborted'}})
      } else if(this.getMyPlayerName in msg.won){
        this.props.history.push({pathname: '/game-end', state: { mode:'won'}})
      } else{
        this.props.history.push({pathname: '/game-end', state: { mode:'lost'}})
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

    updateMode(mode) {
      this.setState({ mode: mode})
    }

    async requestMoves() {
        let raisedCard = this.myHandContainerRef.current.getRaisedCard();
        const response = await api.get(`/game/${this.gameId}/moves`, { params: { code: raisedCard.getCode() } });
        this.myHandContainerRef.current.updateMoves(response.data.moves);
    }

    async requestPossibleMarbles(moveName) {
        this.myHandContainerRef.current.updateSelectedMoveName(moveName);
        
        let raisedCard = this.myHandContainerRef.current.getRaisedCard();
        let remainingSevenMoves = this.boardRef.current.getRemainingSevenMoves();
        const response = await api.get(`/game/${this.gameId}/possible-marbles`, { params: { 
            code: raisedCard.getCode(),
            moveName: moveName,
            remainingSevenMoves: remainingSevenMoves
        } });
        this.boardRef.current.updatePossibleMarbles(response.data.marbles);

        this.myHandContainerRef.current.resetMoves()
    }

    async requestPossibleTargetFields() {
      let cardToPlay = this.myHandContainerRef.current.getRaisedCard();
      let moveNameToPlay = this.myHandContainerRef.current.getMoveNameToPlay();
      let marbleToPlay = this.boardRef.current.getMarbleToPlay();
      let marbleId = marbleToPlay.getId();
      let remainingSevenMoves = this.boardRef.current.getRemainingSevenMoves();

      const response = await api.get(`/game/${this.gameId}/possible-target-fields`, { params: { 
          code: cardToPlay.getCode(), 
          moveName: moveNameToPlay, 
          marbleId: marbleId,
          remainingSevenMoves: remainingSevenMoves
      } });

      let possibleTargetFieldKeys = response.data.targetFieldKeys
      this.boardRef.current.updatePossibleTargetFields(possibleTargetFieldKeys)
    }

    async throwAway() {
      const response = await api.get(`/game/${this.gameId}/throw-away`);
      let playableCardCodes = response.data

      if(playableCardCodes.length > 0) {
        this.myHandContainerRef.current.handlePlayableCards(playableCardCodes);
      }
    }

    play() {
      let cardToPlay;
      if(this.myHandContainerRef.current.isJokerRaised()) {
        // select joker as card to play
        cardToPlay = this.myHandContainerRef.current.getRaisedCard(true);
      } else {
        cardToPlay = this.myHandContainerRef.current.getRaisedCard();
      }

      let moveNameToPlay = this.myHandContainerRef.current.getMoveNameToPlay();
      let marbleToPlay = this.boardRef.current.getMarbleToPlay();

      // TODO send multiple values on seven (hold stateofSeven)
      let marbles = [{marbleId: marbleToPlay.getId(), targetFieldKey: this.boardRef.current.getTargetField().getKey()}];
      
      this.props.websocketContext.sockClient.send(`/app/game/${this.gameId}/play`, {
        code: cardToPlay.getCode(), 
        moveName: moveNameToPlay, 
        marbles: marbles
      });

      this.reset();
    }

    reset() {
      this.myHandContainerRef.current.resetAll();
      this.boardRef.current.resetAll();
    }

    sendReadyMessage() {
     this.props.websocketContext.sockClient.send(`/app/game/${this.gameId}/ready`, {});
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
                <Facts facts={this.state.facts} />
                <Notifications notifications={this.state.notifications} />
                <Board 
                  size={500} 
                  ref={this.boardRef} 
                  requestPossibleMarbles={this.requestPossibleMarbles}
                  requestPossibleTargetFields={this.requestPossibleTargetFields} 
                  myHandContainerRef={this.myHandContainerRef}
                />
                <HandContainer position="my">
                  <MyHand 
                    ref={this.myHandContainerRef} 
                    myHandRef={this.myHandRef} 
                    mode={this.state.mode} 
                    requestMoves={this.requestMoves} 
                    requestPossibleMarbles={this.requestPossibleMarbles} 
                    play={this.play} 
                    reset={this.reset} 
                    throwAway={this.throwAway} 
                    updateMode={this.updateMode}>
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

export default withRouter(withBackgroundContext(withForegroundContext(withWebsocketContext(Game))));