import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import View from "../View";
import { viewLinks } from "../../helpers/constants";

class GameEnd extends React.Component {

  constructor() {
    super();
    this.state = {
      username: "Sandro"
    };
  }

  render() {
    return (
      <View className="game-end" title={this.props.location.state.title} isDogVisible={true} linkMode={viewLinks.BASIC}>
        <main className="small">
            <p>{this.props.location.state.text}</p>      
            <Link to="/home">Leave and return to Home</Link>
          </main>
      </View>
    );
  }
}

export default withRouter(GameEnd);