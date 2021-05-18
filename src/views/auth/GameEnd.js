import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import sessionManager from "../../helpers/sessionManager";
import AuthView from '../AuthView';

class GameEnd extends React.Component {

  constructor() {
    super();
    this.myUsername = localStorage.getItem("username")
    sessionManager.setGameId(null)
  }

  render() {
    let {gameEndMessage} = this.props.location.state;
    var title, text;

    if(gameEndMessage.aborted != null) {
      title = `${gameEndMessage.aborted} left the game!`;
      text = `We are sorry! The game has been aborted because ${gameEndMessage.aborted} left the game. You wanna play again?`;
    } else if(gameEndMessage.won.find(username => this.myUsername === username) !== undefined){
      title = "Congrats, you won!"; 
      text = "Good game! Thanks for playing Brändi Dog Online with us. You wanna play again?";
    } else{ 
      title = "Sorry, you lost!"; 
      text = "No one is born a master! Thanks for playing Brändi Dog Online with us. You wanna play again?";
    }

    return (
      <AuthView className="game-end" title={title}>
        <main className="small">
            <p>{text}</p>      
            <p className="below-text"><Link to="/home">Leave and return to Home</Link></p>
          </main>
      </AuthView>
    );
  }
}

export default withRouter(GameEnd);