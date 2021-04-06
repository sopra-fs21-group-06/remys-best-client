import React from 'react';
import { withRouter } from 'react-router-dom';
import NavigationLink from "../../components/NavigationLink";

class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      name: null,
      username: "Sandro"
    };
  }

  render() {
    return (
      <div className="homeScreen">
        <NavigationLink position="header" name="Intruction" to="/instruction" />

        <div className="">
          <img />
          <h1>Welcome back, {this.props.username}</h1>
        </div>
        <div></div>

        <div className="">
          <p>How do you want to play Brändi Dog?</p>
          <div className="box">
            <p className="title">Single Player</p>
            <p className="subtitle">Play with random people</p>
          </div>
          <div className="box"> 
            <p className="title">Create New Game</p>
            <p className="subtitle">Play with your friends</p>
          </div>
          <p>or just wait here to get invited</p>
        </div>
        
        <footer><p>Brändi Dog is a card game made by <a href="https://www.braendi.ch/">Stiftung Brändi</a></p></footer>
        <NavigationLink position="footer" name="About" to="/about" />
      </div>
    );
  }
}

export default withRouter(Home);