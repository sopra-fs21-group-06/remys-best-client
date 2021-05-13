import React from 'react';
import { withRouter } from 'react-router-dom';
import View from "../View";
import { viewLinks } from "../../helpers/constants"
import BoxWithUsers from '../../components/BoxWithUsers';
import FriendsFilter from '../../components/FriendsFilter';
import sessionManager from "../../helpers/sessionManager";
import WebsocketConsumer from '../../components/context/WebsocketConsumer';
import { createChannel, createUser } from '../../helpers/modelUtils';
import { withWebsocketContext } from '../../components/context/WebsocketProvider';
import { userCategories } from '../../helpers/constants';

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
      // todo endpoint accepted users (if some has accepted, if someone leaves)
    ]
  }

  componentWillUnmount() {
    this.props.websocketContext.sockClient.send(`/app/gamesession/${this.gameSessionId}/leave`, {});
  }

  handleGameSessionEndMessage(msg) {
    this.props.history.push({pathname: '/game-end', state: {usernameWhichHasLeft: msg.hostName, mode:'aborted'}})
  }

  handleInvitedUserMessage(msg) {
    let invitedUsers = msg.invitedUsers.map(invitedUser => {
      return createUser(invitedUser.username, "inviteduser@foo.ch", null, userCategories.INVITED)
    })

    let currentPlayersWithoutInvitedOnes = this.state.currentPlayers.filter(player => {
      return player.getCategory() !== userCategories.INVITED
    })

    console.log(currentPlayersWithoutInvitedOnes)
    console.log(currentPlayersWithoutInvitedOnes.concat(invitedUsers))

    this.setState({currentPlayers: currentPlayersWithoutInvitedOnes.concat(invitedUsers)});
  }

  handleCountdownMessage(msg) {
    this.setState(prevState => {
        const currentPlayers = prevState.currentPlayers.map(currentPlayer => {
            if (currentPlayer.getUsername() === msg.username) {
                currentPlayer.setStatus(msg.currentCounter)
            } 
            return currentPlayer;
        });
        return {currentPlayers: currentPlayers};
    });
  }

  fillUpWithRandomPlayers() {
    // TODO call endpoint
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
                  <BoxWithUsers title="Current Players" users={this.state.currentPlayers} />
                  <div className="link-below-box"><p className="clickable" onClick={() => this.fillUpWithRandomPlayers()}>Fill up with random players</p></div>
                </div>
              </div>
            </main>
        </View>
      </WebsocketConsumer>
    );
  }
}

export default withRouter(withWebsocketContext(CreateNewGame));