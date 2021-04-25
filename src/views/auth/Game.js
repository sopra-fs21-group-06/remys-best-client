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
import { generateUUID } from '../../helpers/remysBestUtils';
import sessionManager from "../../helpers/sessionManager";
import { WebsocketContext } from '../../components/websocket/WebsocketProvider';
import { roundModes } from '../../helpers/constants';
import { withBackgroundContext } from '../../components/Background';

class Game extends React.Component {

    static contextType = WebsocketContext;

    constructor(props) {
      super(props);

      this.myHandRef = React.createRef();
      this.rightHandRef = React.createRef();
      this.leftHandRef = React.createRef();
      this.partnerHandRef = React.createRef();
      let players = [];
      let foo = this.props.location.state.players
      let colors = ["BLUE", "GREEN", "RED", "YELLOW"]
      foo.forEach(player => {
        if(player.playerName === localStorage.getItem("username")) {
          players.push(createPlayer(player.playerName, this.myHandRef, 0))
          let colorIdx = colors.indexOf(player.color)
          

          // TODO all palyers must be stored (no null values)
          colorIdx += 1   
          let rightPlayer = foo.find(player => player.color === colors[colorIdx % colors.length]);
          if(rightPlayer) {
            players.push(createPlayer(rightPlayer.playerName, this.rightHandRef, 90))
          }
          
          colorIdx += 1
          let partnerPlayer = foo.find(player => player.color === colors[colorIdx % colors.length]);
          players.push(createPlayer(partnerPlayer.playerName, this.partnerHandRef, 180))
          
          colorIdx += 1  
          let leftPlayer = foo.find(player => player.color === colors[colorIdx % colors.length]);
          if(leftPlayer) {
            players.push(createPlayer(leftPlayer.playerName, this.leftHandRef, -90))
          }
        }
      })

      this.state = {
        players: players,
        facts: [],
        notifications: [],
        allCards: [],
        mode: roundModes.IDLE,
        movableMarbles: [],
      }
      this.playMyCard = this.playMyCard.bind(this);

      

      this.boardRef = React.createRef();
      this.gameId = sessionManager.getGameId();
      this.channels = [
        createChannel(`/topic/game/${this.gameId}/facts`, (msg) => this.handleFactsMessage(msg)),
        createChannel(`/topic/game/${this.gameId}/notification`, (msg) => this.handleNotificationMessage(msg)),
        createChannel(`/topic/game/${this.gameId}/turn`, (msg) => this.handleTurnChangedMessage(msg)),
        createChannel(`/topic/game/${this.gameId}/played`, (msg) => this.handlePlayedMessage(msg)),
        createChannel(`/user/queue/game/${this.gameId}/cards`, (msg) => this.handleCardsReceivedMessage(msg))
      ]

      this.exchange = this.exchange.bind(this)
      this.handleMovableMarbles = this.handleMovableMarbles.bind(this)
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

    generateOtherCards(cardAmount) {
      let otherCards = [];
      for(let i = 0; i < cardAmount; i++) {
        otherCards.push(createCard(generateUUID(), dogCard))
      }
      return otherCards;
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

    getMyHandRef() {
      let myHandRef = null
      this.state.players.forEach(player => {
        if(player.getPlayerName() === localStorage.getItem("username")) {
          myHandRef = player.getHandRef()
        }
      })
      return myHandRef
    }

    handleCardsReceivedMessage(msg) {
      console.log("-- CARDS RECEIVED ")
      console.log(msg)

      let allCards = this.state.allCards;
      let myCards = msg.cards.map(card => {
        return allCards.find(allCardsCard => allCardsCard.getCode() === card.code)
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

    handleTurnChangedMessage(msg) {
      if(localStorage.getItem("username") === msg.playerName) {
        this.setState({ mode: roundModes.MY_TURN })
      }

      // TODO show current turn big message over whole screen
    }

    handlePlayedMessage(msg) {
      // TODO play card from players hand if not my player
    }

    handleMovableMarbles(movableMarbles) {
      console.log("movable marbles received in game")
      console.log(movableMarbles)
      this.setState({ movableMarbles: movableMarbles })
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

    sendReady() {
     this.context.sockClient.send(`/app/game/${this.gameId}/ready`, {});
    }

    exchange(cardToExchange) {
      this.getMyHandRef().current.removeCard(cardToExchange)
      this.context.sockClient.send(`/app/game/${this.gameId}/card-exchange`, {code: cardToExchange.getCode()}); 
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
                <Board size={500} ref={this.boardRef}/>
                {/*
                <p onClick={() => this.playCard(this.state.players[1], OPP_CARDS[Math.floor(Math.random() * 6)], null )}>play from left opponent</p>
                <p onClick={() => this.playCard(this.state.players[2], OPP_CARDS[Math.floor(Math.random() * 6)], null )}>play from right opponent</p>
                */}


            
                <HandContainer position="my">
                  <MyHand handRef={this.myHandRef} playMyCard={this.playMyCard} mode={this.state.mode} exchange={this.exchange} handleMovableMarbles={this.handleMovableMarbles}>
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
        </WebsocketConsumer>
      );
    }
}

export default withRouter(withBackgroundContext(Game));