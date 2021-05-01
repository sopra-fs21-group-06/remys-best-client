import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import View from "../View";
import { viewLinks } from "../../helpers/constants";
import Avatar from "../../components/Avatar"
import Board from "../../components/ingame/Board";
import Box from "../../components/Box";
import { colors } from "../../helpers/constants";
import { createChannel } from '../../helpers/modelUtils';
import { WebsocketContext } from '../../components/websocket/WebsocketProvider';
import WebsocketConsumer from '../../components/websocket/WebsocketConsumer';
import avatar from '../../img/avatar.png';
<<<<<<< HEAD
import { getGameId } from "../../helpers/sessionManager";
=======
import sessionManager from "../../helpers/sessionManager";
>>>>>>> dev

class ChoosePlace extends React.Component {

  static contextType = WebsocketContext;

  constructor(props) {
    super(props);

    this.state = {
      players: this.props.location.state.players
    };

    this.avatarColorNames = [colors.BLUE.name, colors.GREEN.name, colors.RED.name, colors.YELLOW.name]
<<<<<<< HEAD
    this.gameId = getGameId();

    // TODO store gameId in session Manager
    this.channels = [
      createChannel(`/topic/game/${this.gameId}/colors`, (msg) => this.handleChoosePlaceMessage(msg)),
      createChannel(`/topic/game/${this.gameId}/startGame`, () => this.handleStartGameMessage())
=======
    this.gameId = sessionManager.getGameId();
    this.channels = [
      createChannel(`/topic/game/${this.gameId}/colors`, (msg) => this.handleChoosePlaceMessage(msg)),
>>>>>>> dev
    ]
  }

  handleChoosePlaceMessage(msg){
    var players = msg.players;

    // inject dummy avatar
    players.forEach(player => {
      player.avatar = avatar
    })
<<<<<<< HEAD

    this.setState({
      players: players
    });
  }

  handleStartGameMessage(){
    this.props.history.push('/game')
=======
    this.setState({ players: players });

    if(msg.startGame) {
      this.props.history.push({pathname: '/game', state: {players: msg.players}})
    }
>>>>>>> dev
  }

  handleChangeColor(pickedColorName) {    
    this.context.sockClient.send(`/app/game/${this.gameId}/choose-color`, { color: pickedColorName });
  }

  getMyPlayer(players) {
<<<<<<< HEAD
    let myPlayername = localStorage.getItem("username") // TODO improvements?
=======
    let myPlayername = localStorage.getItem("username") // TODO improvement?
>>>>>>> dev
    return players.find(player => player.playerName == myPlayername)
  }

  getAvatarFromColor(colorName) {
    let correspondingPlayer = this.state.players.find(player => player.color == colorName)
    return correspondingPlayer ? correspondingPlayer.avatar : null
  }

  getMyPartner() {
    let players = this.state.players;
    let myPlayer = this.getMyPlayer(players)
    let myPartner;

<<<<<<< HEAD
=======

    // TODO compute team mate on backend?
>>>>>>> dev
    if(myPlayer.color == colors.BLUE.name) {
      myPartner = players.find(player => player.color == colors.RED.name)
    } else if(myPlayer.color == colors.GREEN.name) {
      myPartner = players.find(player => player.color == colors.YELLOW.name)
    } else if(myPlayer.color == colors.RED.name) {
      myPartner = players.find(player => player.color == colors.BLUE.name)
    } else if(myPlayer.color == colors.YELLOW.name) {
      myPartner = players.find(player => player.color == colors.GREEN.name)
    }

    return myPartner ? myPartner.playerName : "nobody yet";
  }

  render() {
    return (
      <WebsocketConsumer channels={this.channels}>
        <View className="choose-place" withDogImgHidden linkMode={viewLinks.BASIC}>
          <main>
              <div className="col-left">
                <div className="above-box">
                  <h1>Choose your place</h1>
                  <p className="intro">Almost done! A new game will be started after everybody has picked a place. Choose your color by clicking on a seat.</p>  
                </div>
                <Box>
                  {this.state.players.map(player => {
                      return (
                          <p key={player.playerName}>
                            <span>{player.playerName}</span> – {player.color ? player.color : "not chosen yet"} 
                            {player.color ? <span className="remove" onClick={() => this.handleChangeColor(null)}></span> : null}
                          </p>
                      );
                  })}
                  <p><span>You</span> are with <span>{this.getMyPartner()}</span></p>
                </Box>
                <div className="below-box"><Link to="/home">Leave and return to Home</Link></div>
                <div className="below-box"><Link to="/game">Game</Link></div>
              </div>
              <div className="col-right">
                <div className="board-container" style={{width: 500, height: 500}}>
                  <Board size={300}/>
                  {this.avatarColorNames.map(colorName => {
                      return (
                          <Avatar 
                            key={colorName}
                            colorName={colorName} 
                            img={this.getAvatarFromColor(colorName)} 
                            onClick={() => this.handleChangeColor(colorName)} 
                          />
                      );
                  })}
                </div>
              </div>
            </main>
        </View>
      </WebsocketConsumer>
    );
  }
}

<<<<<<< HEAD
export default withRouter(ChoosePlace);



/*

<BackgroundContext.Consumer>
            {context => (
              <div>
                <button onClick={() => context.dispatch({type: "blue-bottom"})}>Change blue</button>
                <button onClick={() => context.dispatch({type: "yellow-bottom"})}>Change yellow</button>
                <button onClick={() => context.dispatch({type: "red-bottom"})}>Change red</button>
                <button onClick={() => context.dispatch({type: "green-bottom"})}>Change green</button>
              </div>
            )} 
          </BackgroundContext.Consumer>


          */
=======
export default withRouter(ChoosePlace);
>>>>>>> dev
