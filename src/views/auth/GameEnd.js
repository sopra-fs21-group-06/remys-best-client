import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import View from "../View";
import { viewLinks } from "../../helpers/constants";
<<<<<<< HEAD
import sessionManager from "../../helpers/sessionManager";
=======
import { setGameId } from "../../helpers/sessionManager";
>>>>>>> 1d7b81c (websocket basic implementation, first test until game screen (#111))

class GameEnd extends React.Component {

  constructor() {
    super();
    this.state = {
<<<<<<< HEAD
      username: localStorage.getItem("username")
    };
    sessionManager.setGameId(null)
=======
      username: "Sandro"
    };
    setGameId(null)
>>>>>>> 1d7b81c (websocket basic implementation, first test until game screen (#111))
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
      <View className="game-end" title={title}  linkMode={viewLinks.BASIC}>
        <main className="small">
            <p>{text}</p>      
            <Link to="/home">Leave and return to Home</Link>
          </main>
      </View>
    );
  }
}

export default withRouter(GameEnd);