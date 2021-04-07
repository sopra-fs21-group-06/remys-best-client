import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import View from "../View";
import { viewLinks } from "../../helpers/constants";
import Avatar from "../../components/Avatar"
import Box from '../../components/Box';
import avatar from '../../img/avatar.png'

class WaitingRoom extends React.Component {

  constructor() {
    super();
    this.state = {
      username: "Sandro"
    };
  }

  render() {
    return (
      <View className="waiting-room" title="Waiting Room" isDogVisible={true} linkMode={viewLinks.BASIC}>
        <main className="small">
            <p className="above-box">As soon as four players are ready, a new game will automatically be started. You could also be picked from an existing game session to fill up their game</p>      
            <div className="queue">
              <p className="above-players">You are in the second place</p>
              <Box className="players">
                <Avatar color="red" />
                <Avatar color="blue" />
                <Avatar color="yellow" />
                <Avatar color="green" img={avatar}/>
              </Box>
              <p className="below-players"><Link to="/home">Leave and return to Home</Link></p>
              <p className="below-players"><Link to="/choose-place">Choose Place</Link></p>
            </div>
          </main>
      </View>
    );
  }
}

export default withRouter(WaitingRoom);