import React from 'react';
<<<<<<< HEAD
import { withRouter, Link } from 'react-router-dom';
=======
import {Link, withRouter} from 'react-router-dom';
>>>>>>> dev
import Board from "../../components/ingame/Board";
import MyHand from "../../components/ingame/hand/MyHand";
import Hand from "../../components/ingame/hand/Hand";
import dogCard from "../../img/dog-card.png"
import HandContainer from "../../components/ingame/hand/HandContainer";
<<<<<<< HEAD
import { createPlayer } from '../../helpers/modelUtils'
import View from "../View";
import { viewLinks, gameEndModes } from "../../helpers/constants";
import RoundFacts from "../../components/ingame/RoundFacts";
import NotificationList from "../../components/ingame/NotificationList";

/*
TODO:
- activate menus my card if is my turn
- chose move on board for every card
*/

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
      this.playMyCard = this.playMyCard.bind(this);
      this.myHandRef = React.createRef();
      this.leftHandRef = React.createRef();
      this.rightHandRef = React.createRef();
      this.partnerHandRef = React.createRef();
      this.boardRef = React.createRef();
    }

    
    componentDidMount() {

        // TODO

       
        let players = [];
        players.push(createPlayer("my player", this.myHandRef, 0, "blue"))
        players.push(createPlayer("username2", this.leftHandRef, -90, "yellow"))
        players.push(createPlayer("username3", this.rightHandRef, 90, "green"))
        players.push(createPlayer("username4", this.partnerHandRef, 180, "red"))
        this.setState({players: players});

        this.handOutCards();
    }

    playMyCard(card, move) {
      this.playCard(this.state.players[0], card, move)
    }

    playCard(player, card, move) {
      player.getHandRef().current.removeCard(card)
      setTimeout(function(){ 
          // todo add player position for rotation
          this.boardRef.current.throwInCard(player, card);
      }.bind(this), 300);
      setTimeout(function(){ 
          this.boardRef.current.moveMarble()
      }.bind(this), 1300);
    }

    handOutCards() {
      this.myHandRef.current.addCards(MY_CARDS)
      this.leftHandRef.current.addCards(OPP_CARDS)
      this.rightHandRef.current.addCards(OPP_CARDS)
      this.partnerHandRef.current.addCards(OPP_CARDS)
=======
import View from "../View";
import {cardImages, gameEndModes, roundModes, viewLinks} from "../../helpers/constants";
import Facts from "../../components/ingame/Facts";
import Notifications from "../../components/ingame/Notifications";
import WebsocketConsumer from '../../components/websocket/WebsocketConsumer';
import {createCard, createChannel} from '../../helpers/modelUtils';
import {assignPlayersToColors, generateUUID} from '../../helpers/remysBestUtils';
import sessionManager from "../../helpers/sessionManager";
import {WebsocketContext} from '../../components/websocket/WebsocketProvider';
import {withBackgroundContext} from '../../components/Background';

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
      this.requestPossibleTargetFields = this.requestPossibleTargetFields.bind(this)
      this.gameId = sessionManager.getGameId();
      this.channels = [
        createChannel(`/topic/game/${this.gameId}/facts`, (msg) => this.handleFactsMessage(msg)),
        createChannel(`/topic/game/${this.gameId}/notification`, (msg) => this.handleNotificationMessage(msg)),
        createChannel(`/topic/game/${this.gameId}/turn`, (msg) => this.handleTurnChangedMessage(msg)),
        createChannel(`/topic/game/${this.gameId}/played`, (msg) => this.handlePlayedMessage(msg)),
        createChannel(`/user/queue/game/${this.gameId}/cards`, (msg) => this.handleCardsReceivedMessage(msg)),
        createChannel(`/user/queue/game/${this.gameId}/target-fields-list`, (msg) => this.handleTargetFieldsListMessage(msg)),
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
        marblesToMove.forEach(marbleToMove => {
          this.boardRef.current.moveMarble(marbleToMove.marbleId, marbleToMove.targetFieldKey);
        })
      }.bind(this), 1500);
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

    handleTargetFieldsListMessage(msg) {
      // TODO process data from backend
      console.log(msg)
      let possibleTargetFieldKeys = msg.targetFieldKeys
      // fieldKey (unique): id + color (e.g. 4GREEN)

      this.boardRef.current.updatePossibleTargetFields(possibleTargetFieldKeys)
    }


    handlePlayerDisconnection(msg) {
      if(msg.aborted!=null){
        this.props.history.push({pathname: '/game-end', state: {usernameWhichHasLeft: msg.aborted, mode:'aborted'}})
      }else if(this.getMyPlayerName in msg.won){
        this.props.history.push({pathname: '/game-end', state: { mode:'won'}})
      }else{
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

    //
    //
    //
    //
    requestPossibleTargetFields() {
      let cardToPlay = this.myHandContainerRef.current.getCardToPlay();
      let moveNameToPlay = this.myHandContainerRef.current.getMoveNameToPlay();
      let marbleToPlay = this.boardRef.current.getMarbleToPlay();
      let marbleId = marbleToPlay.getId();
      this.context.sockClient.send(`/app/game/${this.gameId}/target-fields-request`, {
        code: cardToPlay.getCode(), 
        moveName: moveNameToPlay, 
        marbleId: marbleId
      });
    }

    play() {
      let cardToPlay = this.myHandContainerRef.current.getCardToPlay();
      let moveNameToPlay = this.myHandContainerRef.current.getMoveNameToPlay();
      let marbleToPlay = this.boardRef.current.getMarbleToPlay();

      //TODO no clue which attribute needs to be sent
        let marbles = [{marbleId: marbleToPlay.getId(), targetFieldKey: this.boardRef.current.getTargetField().getKey()}];
        //let targetField = this.boardRef.current.getTargetField();
        //marbles.targetFielKey = this.boardRef.current.getTargetField().getKey();


      this.context.sockClient.send(`/app/game/${this.gameId}/play`, {
        code: cardToPlay.getCode(), 
        moveName: moveNameToPlay, 
        marbles: marbles

        // TODO targetField(s) submission
        // fieldKey (e.g. "4GREEN", "8BLUE")
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
>>>>>>> dev
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
<<<<<<< HEAD
          <View className="game" withFooterHidden withDogImgHidden linkMode={viewLinks.BASIC}>
            <main>
                <RoundFacts roundNumber={1} activePlayer="You" nextRoundCardAmount={5} nextRoundBeginner="Andrina"/>
                <NotificationList />
                <Board size={500} ref={this.boardRef} />
                {/*
                <p onClick={() => this.playCard(this.state.players[1], OPP_CARDS[Math.floor(Math.random() * 6)], null )}>play from left opponent</p>
                <p onClick={() => this.playCard(this.state.players[2], OPP_CARDS[Math.floor(Math.random() * 6)], null )}>play from right opponent</p>
                */}


                
                <HandContainer position="my">
                  <MyHand handRef={this.myHandRef} playMyCard={this.playMyCard} isMyTurn={true}>
                    <Hand ref={this.myHandRef} />
=======
        <WebsocketConsumer channels={this.channels} connectionCallback={() => this.sendReadyMessage()}>
          <View className="game" withFooterHidden withDogImgHidden linkMode={viewLinks.BASIC}>
            <main>
                <Facts facts={this.state.facts}/>
                <Notifications notifications={this.state.notifications} />
                <Board size={500} ref={this.boardRef} requestPossibleTargetFields={this.requestPossibleTargetFields} myHandContainerRef={this.myHandContainerRef}/>
                <HandContainer position="my">
                  <MyHand ref={this.myHandContainerRef} myHandRef={this.myHandRef} mode={this.state.mode} play={this.play} reset={this.reset}>
                    <Hand ref={this.myHandRef} isActive={this.state.mode !== roundModes.IDLE}/>
>>>>>>> dev
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
<<<<<<< HEAD
=======
        </WebsocketConsumer>
>>>>>>> dev
      );
    }
}

<<<<<<< HEAD
export default withRouter(Game);
=======
export default withRouter(withBackgroundContext(Game));
>>>>>>> dev
