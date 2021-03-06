import React from 'react';
import {withRouter} from 'react-router-dom';
import Board from "../../components/ingame/board/Board";
import MyHand from "../../components/ingame/hand/MyHand";
import Hand from "../../components/ingame/hand/Hand";
import dogCard from "../../img/dog-card.png"
import HandContainer from "../../components/ingame/hand/HandContainer";
import { cardImages, roundModes } from "../../helpers/constants";
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
import { api, handleError } from '../../helpers/api';
import InGameView from '../InGameView';
import ErrorMessage from '../../components/alert/ErrorMessage';

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
        createChannel(`/user/queue/game/${this.gameId}/cards`, (msg) => this.handleCardsReceivedMessage(msg))
      ]
    }

    componentDidMount() {
      let allCards = Object.keys(cardImages).map(cardCode => {
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

    // the display of the current turn message is triggered in handleThrowAwayMessage and handlePlayedMessage
    handleTurnChangedMessage(msg) {
      let currentTurnPlayerName = this.state.currentTurnPlayerName
      let playerName = msg.playerName
      let mode

      if(this.isMyPlayerName(playerName)) {
        mode = roundModes.MY_TURN
      } else {
        mode = roundModes.IDLE
      }

      this.setState({ 
        mode: mode,
        currentTurnPlayerName: playerName
      }, () => {
        // at the beginning of a round, TODO round switches??
        if(currentTurnPlayerName === null) {
          this.displayCurrentTurnMessage(playerName)
        }
      })      
    }

    handleThrowAwayMessage(msg) {
      let cardsToThrowAway = msg.cardCodes.map(cardCode => {
        return this.getCardFromCode(cardCode)
      }) 
      let player = this.state.players.find(player => player.getPlayerName() === msg.playerName)

      player.getHandRef().current.removeAllCards()

      let actions = [];
      actions.push(() => this.boardRef.current.throwInAllCards(player, cardsToThrowAway))
      actions.push(() => this.displayCurrentTurnMessage())

      this.executeFunctionsSequentially(actions)
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

      let actions = [];
      actions.push(() => this.boardRef.current.throwInCard(player, cardToPlay))
      actions.push(() => marblesToMove.forEach(marbleToMove => {
        this.boardRef.current.moveMarble(marbleToMove.marbleId, marbleToMove.targetFieldKey);
      }))

      if(marblesToSendHome.length !== 0) {
        actions.push(() => marblesToSendHome.forEach(marbleToSendHome => {
          this.boardRef.current.moveMarble(marbleToSendHome.marbleId, marbleToSendHome.targetFieldKey);
        }))
      }

      actions.push(() => this.displayCurrentTurnMessage())

      this.executeFunctionsSequentially(actions)
    }

    executeFunctionsSequentially(functions) {
      for(let i = 0; i < functions.length; i++) {
        setTimeout(() => { 
          functions[i]()
        }, 500 + (i*1200));
      }
    }

    handleCardsReceivedMessage(msg) {
      let myCards = msg.cards.map(card => {
        return this.getCardFromCode(card.code)
      })
      
      this.getMyHandRef().current.addCards(myCards)

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

    displayCurrentTurnMessage() {
      let currentTurnPlayerName = this.state.currentTurnPlayerName

      if(this.isMyPlayerName(currentTurnPlayerName)) {
        currentTurnPlayerName = "your"
      } else {
        currentTurnPlayerName += "'s"
      }

      this.props.foregroundContext.displayCurrentTurnMessage(currentTurnPlayerName)
    }

    async requestMoves() {
        let raisedCard = this.myHandContainerRef.current.getRaisedCard();
        try {
          const response = await api.get(`/game/${this.gameId}/moves`, { params: { code: raisedCard.getCode() } });
          this.myHandContainerRef.current.updateMoves(response.data.moves);
        } catch (error) {
          this.props.foregroundContext.showAlert(<ErrorMessage text={handleError(error)}/>, 5000)
        }
    }

    async requestPossibleMarbles(moveName) {
        try {
            this.myHandContainerRef.current.updateSelectedMoveName(moveName);
        
            let raisedCard = this.myHandContainerRef.current.getRaisedCard();
            let sevenMoves = this.boardRef.current.getSevenMoves();

            const requestBody = JSON.stringify({
                code: raisedCard.getCode(),
                moveName: moveName,
                sevenMoves: sevenMoves
            });
            const response = await api.post(`/game/${this.gameId}/possible-marbles`, requestBody);

            this.boardRef.current.updateMovableMarbles(response.data.marbles);
            this.myHandContainerRef.current.resetMoves()
        } catch (error) {
            this.props.foregroundContext.showAlert(<ErrorMessage text={handleError(error)}/>, 5000)
        }
    }

    async requestPossibleTargetFields() {
      try {
          let cardToPlay = this.myHandContainerRef.current.getRaisedCard();
          let moveNameToPlay = this.myHandContainerRef.current.getMoveNameToPlay();
          let marbleId = this.boardRef.current.getMarbleToPlay().getId();
          let sevenMoves = this.boardRef.current.getSevenMoves();

          const requestBody = JSON.stringify({
              code: cardToPlay.getCode(), 
              moveName: moveNameToPlay, 
              marbleId: marbleId,
              sevenMoves: sevenMoves
          });

          const response = await api.post(`/game/${this.gameId}/possible-target-fields`, requestBody);

          let possibleTargetFieldKeys = response.data.targetFieldKeys
          this.boardRef.current.updatePossibleTargetFields(possibleTargetFieldKeys)
      } catch (error) {
          this.props.foregroundContext.showAlert(<ErrorMessage text={handleError(error)}/>, 5000)
      }
    }

    async throwAway() {
      try {
        const response = await api.get(`/game/${this.gameId}/throw-away`);
        let playableCardCodes = response.data

        if(playableCardCodes.length > 0) {
          this.myHandContainerRef.current.handlePlayableCards(playableCardCodes);
        }
      } catch (error) {
        this.props.foregroundContext.showAlert(<ErrorMessage text={handleError(error)}/>, 5000)
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

      let marbles = [];

      if(this.myHandContainerRef.current.isSevenRaised()) {
        marbles = this.boardRef.current.getSevenMoves();
      } else {
        marbles.push({marbleId: marbleToPlay.getId(), targetFieldKey: this.boardRef.current.getTargetField().getKey()})
      }
      
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
     this.props.websocketContext.sockClient.send(`/app/game/${this.gameId}/ready`);
    }

    render() {
      return (
        <WebsocketConsumer channels={this.channels} connectionCallback={() => this.sendReadyMessage()}>
          <InGameView className="game">
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
            </main>
          </InGameView>     
        </WebsocketConsumer>
      );
    }
}

export default withRouter(withBackgroundContext(withForegroundContext(withWebsocketContext(Game))));