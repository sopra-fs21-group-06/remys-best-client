import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import View from "../View";
import { viewLinks } from "../../helpers/constants";
import Avatar from "../../components/Avatar"
//import { BackgroundContext } from './components/Background';
import Board from "../../components/ingame/Board";
import Box from "../../components/Box";
import { colors } from "../../helpers/constants";

import avatar from '../../img/avatar.png'

const COLOR_CHANGED = {
  playername: "Andrina",
  color: "blue"
}

const COLOR_CHANGED2 = {
  playername: "Andrina",
  color: null
}

const COLOR_CHANGED3 = {
  playername: "Andrina",
  color: "yellow"
}

class ChoosePlace extends React.Component {

  constructor() {
    super();
    this.state = {
      players: [
        {playername: "Andrina", colorName: null, avatar: avatar},
        {playername: "Siddhant", colorName: null, avatar: avatar},
        {playername: "Pascal", colorName: null, avatar: avatar},
        {playername: "Edi", colorName: null, avatar: avatar}
      ]
    };

    this.avatarColorNames = [colors.BLUE.name, colors.GREEN.name, colors.RED.name, colors.YELLOW.name]
  }

  componentDidMount() {
    // TODO websockets: subscribe to /topic/game/:id/colors
    // update internal state (see below)
  }

  handleChangeColor(pickedColorName) {
    // TODO websockets: publish data to endpoint /app/game/:id/choose-color
    this.setState((currentState, props) => {
      const nextState = {...currentState}
      this.getMyPlayer(currentState.players).colorName = pickedColorName;
      return nextState
    });
  }

  getMyPlayer(players) {
    let myPlayername = "Pascal" // TODO get from local storage after having logged in
    return players.find(player => player.playername == myPlayername)
  }

  getAvatarFromColor(colorName) {
    let correspondingPlayer = this.state.players.find(player => player.colorName == colorName)
    return correspondingPlayer ? correspondingPlayer.avatar : null
  }

  getMyPartner() {
    let players = this.state.players;
    let myPlayer = this.getMyPlayer(players)
    let myPartner;

    if(myPlayer.colorName == colors.BLUE.name) {
      myPartner = players.find(player => player.colorName == colors.RED.name)
    } else if(myPlayer.colorName == colors.GREEN.name) {
      myPartner = players.find(player => player.colorName == colors.YELLOW.name)
    } else if(myPlayer.colorName == colors.RED.name) {
      myPartner = players.find(player => player.colorName == colors.BLUE.name)
    } else if(myPlayer.colorName == colors.YELLOW.name) {
      myPartner = players.find(player => player.colorName == colors.GREEN.name)
    }

    return myPartner ? myPartner.playername : "nobody yet";
  }

  render() {
    return (
      <View className="choose-place" linkMode={viewLinks.BASIC}>
        <main>
            <div className="col-left">
              <div className="above-box">
                <h1>Choose your place</h1>
                <p className="intro">Almost done! A new game will be started after everybody has picked a place. Choose your color by clicking on a seat.</p>  
              </div>
              <Box>
                {this.state.players.map(player => {
                    return (
                        <p key={player.playername}>
                          <span>{player.playername}</span> – {player.colorName ? player.colorName : "not chosen yet"} 
                          {player.colorName ? <span className="remove" onClick={() => this.handleChangeColor(null)}></span> : null}
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
    );
  }
}

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