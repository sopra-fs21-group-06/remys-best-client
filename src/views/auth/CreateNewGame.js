import React from 'react';
import { withRouter } from 'react-router-dom';
import View from "../View";
import { viewLinks } from "../../helpers/constants"
import BoxWithUsers from '../../components/BoxWithUsers';
import FriendsFilter from '../../components/FriendsFilter';
import sessionManager from "../../helpers/sessionManager";
import WebsocketConsumer from '../../components/context/WebsocketConsumer';
import { createChannel } from '../../helpers/modelUtils';
import { withWebsocketContext } from '../../components/context/WebsocketProvider';

class CreateNewGame extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPlayers: [],
    };

    this.gameSessionId = sessionManager.getGameSessionId();
    this.channels = [
      createChannel(`/topic/gamesession/${this.gameSessionId}/gamesession-end`, (msg) => this.handleGameSessionEndMessage(msg)),
      createChannel(`/topic/gamesession/${this.gameSessionId}/invited-user`, (msg) => this.handleInvitedUserMessage(msg)),
      createChannel(`/topic/gamesession/${this.gameSessionId}/countdown`, (msg) => this.handleCountdownMessage(msg)),
    ]
  }

  componentWillUnmount() {
    this.props.websocketContext.sockClient.send(`/app/gamesession/${this.gameSessionId}/leave`, {});
  }

  handleGameSessionEndMessage(msg) {
    this.props.history.push({pathname: '/game-end', state: {usernameWhichHasLeft: msg.hostName, mode:'aborted'}})
  }

  handleInvitedUserMessage(msg) {
    let invitedUser = {username: msg.username, email: "inviteduser@foo.ch"}
    this.setState(prevState => { 
      return {currentPlayers: [...prevState.currentPlayers, invitedUser]};
    });
  }

  handleCountdownMessage(msg) {
    this.setState(prevState => {
        const currentPlayers = prevState.currentPlayers.map(currentPlayer => {
            if (currentPlayer.username === msg.username) {
                currentPlayer.status = msg.currentCounter
            } 
            return currentPlayer;
        });
        return {currentPlayers: currentPlayers};
    });
  }

  // TODO align boxes horizontally dynamically with refs and on compDidM
  render() {
    return (
      <WebsocketConsumer channels={this.channels}>
        <View className="create-new-game" title="Create new game" linkMode={viewLinks.BASIC}>
            <main className="large side-by-side">
              <div className="col">
                <p className="above-box">Only friends which are on the home screen can be invited. If you are not friends just send a friend request and wait for the response.</p>
                <div className="friends-filter">
                  <FriendsFilter withInvitation />
                </div>
              </div>
              <div className="col">
                <p className="above-box">After getting invited your friend has 15 seconds to accept your invitation. If the invitation has been accepted it will be marked in the list below, otherwise your friend will be removed. It is possible to invite friends several times in a row or fill your game up with random players.</p>
                <div className="current-players">
                  <BoxWithUsers title="Current Players" users={this.state.currentPlayers}/>
                  <div className="link-below-box"><p className="clickable">Fill up with random players</p></div>
                </div>
              </div>
            </main>
        </View>
      </WebsocketConsumer>
    );
  }
}

export default withRouter(withWebsocketContext(CreateNewGame));