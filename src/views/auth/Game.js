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
import { createChannel } from '../../helpers/modelUtils';
import sessionManager from "../../helpers/sessionManager";
import { WebsocketContext } from '../../components/websocket/WebsocketProvider';

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


const NOTIFICATIONS = [{
            action: 'Card exchange'
        }, {
            username: 'You',
            action: 'sent',
            card: 'Heart King'
        }, {
            username: 'You',
            action: 'received',
            card: 'Joker'
        }, {
            username: 'Siddhant',
            action: 'played',
            card: 'Clubs Queen'
        }, {
            username: 'Andrina',
            action: 'played',
            card: 'Diamonds Ace'
        }]

class Game extends React.Component {

    static contextType = WebsocketContext;

    constructor() {
      super();
      this.connected = false;
      this.state = {
        players: [],
        facts: [],
        notifications: [],
        allCards: []
      }
      this.playMyCard = this.playMyCard.bind(this);
      this.myHandRef = React.createRef();
      this.leftHandRef = React.createRef();
      this.rightHandRef = React.createRef();
      this.partnerHandRef = React.createRef();
      this.boardRef = React.createRef();
      this.gameId = sessionManager.getGameId();
      this.channels = [
        createChannel(`/topic/game/${this.gameId}/facts`, (msg) => this.handleFactsMessage(msg)),
        createChannel(`/topic/game/${this.gameId}/notification`, (msg) => this.handleNotificationMessage(msg)),
        createChannel(`/user/queue/game/${this.gameId}/cards`, (msg) => this.handleCardsReceivedMessage(msg))
        //createChannel(`/topic/game/${this.gameId}/startGame`, () => this.handleStartGameMessage())
      ]


      this.counter = 0;
    }

    generateOtherCards(amount) {
/*
      {
code: "1",
        imgUrl: dogCard
    }*/

    }

    
    componentDidMount() {
      let allCards = Object.keys(cardImages).map(cardCode => {
        // TODO load img in memory
        return {
          "code": cardCode,
          "imgUrl": cardImages[cardCode]
        }
      })
      this.setState({allCards: allCards});
       
      let players = [];
      players.push(createPlayer("my player", this.myHandRef, 0, "blue"))
      players.push(createPlayer("username2", this.leftHandRef, -90, "yellow"))
      players.push(createPlayer("username3", this.rightHandRef, 90, "green"))
      players.push(createPlayer("username4", this.partnerHandRef, 180, "red"))
      this.setState({players: players});
    }

    addNotification() {
        let notification = NOTIFICATIONS[this.counter];
        notification.key = +new Date()

        this.setState({
            notifications: [
                ...this.state.notifications,
                notification
            ],
        });
        this.counter += 1
    }

    handleFactsMessage(msg) {
      this.setState({ facts: msg.facts })
    } 

    handleNotificationMessage(msg) {
      let notification = msg.notificataion;
      notification.key = +new Date()

      this.setState({
          notifications: [
              ...this.state.notifications,
              notification
          ],
      });
    }

    handleCardsReceivedMessage(msg) {
      let allCards = this.state.allCards;
      let myCards = msg.cards.map(card => {
        return allCards.find(allCardsCard => allCardsCard.code === card.code)
      })
  
      this.myHandRef.current.addCards(myCards)
      this.leftHandRef.current.addCards(OPP_CARDS)
      this.rightHandRef.current.addCards(OPP_CARDS)
      this.partnerHandRef.current.addCards(OPP_CARDS)
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
                <Board size={500} ref={this.boardRef} />
                {/*
                <p onClick={() => this.playCard(this.state.players[1], OPP_CARDS[Math.floor(Math.random() * 6)], null )}>play from left opponent</p>
                <p onClick={() => this.playCard(this.state.players[2], OPP_CARDS[Math.floor(Math.random() * 6)], null )}>play from right opponent</p>
                */}

                <p onClick={() => this.addNotification()}>add notification</p>

                
                <HandContainer position="my">
                  <MyHand handRef={this.myHandRef} playMyCard={this.playMyCard} isMyTurn={true}>
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

export default withRouter(Game);