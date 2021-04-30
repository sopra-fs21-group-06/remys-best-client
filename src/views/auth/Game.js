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

<<<<<<< Updated upstream
        // TODO
=======
      // rotate background and board
      let myPlayer = this.getMyPlayer()
      this.props.backgroundContextValue.dispatch({type: `${myPlayer.getColorName()}-bottom`})
      this.boardRef.current.setBottomClass(`${myPlayer.getColorName()}-bottom`)
      this.handlePlayerConnection()
    }

    handleFactsMessage(msg) {
      this.setState({ facts: msg.facts })
    } 
>>>>>>> Stashed changes

       
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
<<<<<<< Updated upstream
          // todo add player position for rotation
          this.boardRef.current.throwInCard(player, card);
      }.bind(this), 300);
      setTimeout(function(){ 
          this.boardRef.current.moveMarble()
      }.bind(this), 1300);
=======
          this.boardRef.current.throwInCard(player, cardToPlay);
      }.bind(this), 500);

      setTimeout(function() { 
        // e.g. targetFieldKey = "16GREEN"
        this.boardRef.current.moveMarble(marblesToMove[0].marbleId, marblesToMove[0].targetFieldKey);
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

    handlePlayerConnection(msg){
      this.context.sockClient.send(`/app/game/${this.gameId}/game-end`, {});
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
>>>>>>> Stashed changes
    }

    handOutCards() {
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