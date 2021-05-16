import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import sessionManager from "../../helpers/sessionManager";
import AuthView from '../AuthView';

class GameEnd extends React.Component {

  constructor() {
    super();
    this.state = {
      username: localStorage.getItem("username")
    };
    sessionManager.setGameId(null)
  }

  render() {
    let {mode, usernameWhichHasLeft} = this.props.location.state;
    var title, text;

    switch(mode) {
      case "won":
          title = "Congrats, you won!"; 
          text = "Good game! Thanks for playing Brändi Dog Online with us. You wanna play again?";
          break;
      case "lost":
          title = "Sorry, you lost!"; 
          text = "No one is born a master! Thanks for playing Brändi Dog Online with us. You wanna play again?";
          break;
      case "aborted":
          title = `${usernameWhichHasLeft} left the game!`;
          text = `We are sorry! The game has been aborted because ${usernameWhichHasLeft} left the game. You wanna play again?`;
          break;
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