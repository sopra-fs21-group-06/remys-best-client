import React from 'react';
import { withRouter } from 'react-router-dom';
import View from "../View";
import { viewLinks } from "../../helpers/constants"
import BoxWithUsers from '../../components/BoxWithUsers';
import FriendsFilter from '../../components/FriendsFilter';
import sessionManager from "../../helpers/sessionManager";
import WebsocketConsumer from '../../components/context/WebsocketConsumer';
import { createChannel } from '../../helpers/modelUtils';

class CreateNewGame extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      //players: this.props.location.state.players
    };

    this.gameSessionId = sessionManager.getGameSessionId();
    this.channels = [
      createChannel(`/topic/gamesession/${this.gameSessionId}/gamesession-end`, (msg) => this.handleGameSessionEndMessage(msg)),
      createChannel(`/topic/gamesession/${this.gameSessionId}/invited-user`, (msg) => this.handleInvitedUserMessage(msg)),
      createChannel(`/topic/gamesession/${this.gameSessionId}/countdown`, (msg) => this.handleCountdownMessage(msg)),
    ]
  }

  handleGameSessionEndMessage(msg) {
    // msg.hostName "Andrina has closed the game"

  }

  handleInvitedUserMessage(msg) {
    // pending invitation
    // msg.invitedUser [{username: "Adrina"}] 

  }

  handleCountdownMessage(msg) {
    // msg.username msg.currentCounter


  }


  // unmount (leave gameSession)
  // websockets '/app/gamesession/{gameSessionId}/leave'

  

  // TODO align boxes horizontally dynamically with refs and on compDidM
  render() {
    return (
      <WebsocketConsumer channels={this.channels}>
        <View className="create-new-game" title="Create new game" linkMode={viewLinks.BASIC}>
            <main className="large side-by-side">
              <div className="col">
                <p className="above-box">Only friends which are on the home screen can be invited. If you are not friends just send a friend request and wait for the response.</p>
                <div className="friends-filter">
                  <FriendsFilter />
                </div>
              </div>
              <div className="col">
                <p className="above-box">After getting invited your friend has 15 seconds to accept your invitation. If the invitation has been accepted it will be marked in the list below, otherwise your friend will be removed. It is possible to invite friends several times in a row or fill your game up with random players.</p>
                <div className="current-players">
                  <BoxWithUsers title="Current Players" users={[]}/>
                  <div className="link-below-box"><p className="clickable">Fill up with random players</p></div>
                </div>
              </div>
            </main>
        </View>
      </WebsocketConsumer>
    );
  }
}

export default withRouter(CreateNewGame);