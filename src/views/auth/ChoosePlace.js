import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import Avatar from "../../components/Avatar"
import Board from "../../components/ingame/Board";
import Box from "../../components/Box";
import { colors } from "../../helpers/constants";
import { createChannel } from '../../helpers/modelUtils';
import { withWebsocketContext } from '../../components/context/WebsocketProvider';
import WebsocketConsumer from '../../components/context/WebsocketConsumer';
import avatar from '../../img/avatar.png';
import sessionManager from "../../helpers/sessionManager";
import InGameView from '../InGameView';

class ChoosePlace extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      players: this.props.location.state.players
    };

    this.avatarColorNames = [colors.BLUE.name, colors.GREEN.name, colors.RED.name, colors.YELLOW.name]
    this.gameId = sessionManager.getGameId();
    this.channels = [
      createChannel(`/topic/game/${this.gameId}/colors`, (msg) => this.handleChoosePlaceMessage(msg))
    ]
  }

  handleChoosePlaceMessage(msg){
    var players = msg.players;

    // inject dummy avatar
    players.forEach(player => {
      player.avatar = avatar
    })
    this.setState({ players: players });

    if(msg.startGame) {
      this.props.history.push({pathname: '/game', state: {players: msg.players}})
    }
  }

  handleChangeColor(pickedColorName) {    
    this.props.websocketContext.sockClient.send(`/app/game/${this.gameId}/choose-color`, { color: pickedColorName });
  }

  getMyPlayer(players) {
    let myPlayername = localStorage.getItem("username") // TODO improvement?
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


    // TODO compute team mate on backend?
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

  isMyPlayer(playerName) {
    return playerName === localStorage.getItem("username")
  }

  render() {
    return (
      <WebsocketConsumer channels={this.channels}>
        <InGameView className="choose-place" >
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
                            {player.color && this.isMyPlayer(player.playerName) ? <span className="remove" onClick={() => this.handleChangeColor(null)}></span> : null}
                          </p>
                      );
                  })}
                  <p><span>You</span> are with <span>{this.getMyPartner()}</span></p>
                </Box>
                <div className="below-box"><Link to="/home">Leave and return to Home</Link></div>
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
        </InGameView>
      </WebsocketConsumer>
    );
  }
}

export default withRouter(withWebsocketContext(ChoosePlace));