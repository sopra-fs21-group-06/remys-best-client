import React from 'react';
import { withRouter } from 'react-router-dom';
import BoxWithUsers from '../../components/BoxWithUsers';
import FriendsFilter from '../../components/FriendsFilter';
import sessionManager from "../../helpers/sessionManager";
import WebsocketConsumer from '../../components/context/WebsocketConsumer';
import { createChannel, createUser } from '../../helpers/modelUtils';
import { withWebsocketContext } from '../../components/context/WebsocketProvider';
import { userCategories } from '../../helpers/constants';
import AuthView from '../AuthView';

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
      createChannel(`/topic/gamesession/${this.gameSessionId}/accepted`,(msg) => this.handleNewUserMessage(msg)),
      createChannel(`/user/queue/gamesession/${this.gameSessionId}/ready`, (msg) => this.handleGameReadyMessage(msg))
    ]
  }

  componentWillUnmount() {
    this.props.websocketContext.sockClient.send(`/app/gamesession/${this.gameSessionId}/leave`, {});
  }

  handleGameSessionEndMessage(msg) {
    this.props.history.push({pathname: '/game-end', state: {gameEndMessage: msg}})
  }

  handleInvitedUserMessage(msg) {
    let invitedUsers = msg.invitedUsers.map(invitedUser => {
      return createUser(invitedUser.username, "inviteduser@foo.ch", null, userCategories.INVITED)
    })

    let currentPlayersWithoutInvitedOnes = this.state.currentPlayers.filter(player => {
      return player.getCategory() !== userCategories.INVITED
    })

    console.log("currentPlayersWithoutInvitedOnes")
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

  handleNewUserMessage(msg){
    let acceptedUsers = msg.users.map(acceptedUser => {
      return createUser(acceptedUser.username, "friend@friend.ch", "Accepted", userCategories.ACCEPTED)
    })
    let currentPlayersWithoutAcceptedOnes = this.state.currentPlayers.filter(player => {
      return player.getCategory() !== userCategories.ACCEPTED
    })

    console.log("currentPlayersWithoutAcceptedOnes");
    console.log(currentPlayersWithoutAcceptedOnes);
    console.log(acceptedUsers);
    this.setState({currentPlayers: currentPlayersWithoutAcceptedOnes.concat(acceptedUsers)});
    
  }

  fillUpWithRandomPlayers() {
    this.props.websocketContext.sockClient.send(`/app/gamesession/${this.gameSessionId}/fill-up`,{});
  }

  handleGameReadyMessage(msg){
    sessionManager.setGameId(msg.gameId)
    this.props.history.push({pathname: '/choose-place', state: {players: msg.players}})
  }

  // TODO align boxes horizontally dynamically with refs and on compDidM
  render() {
    console.log(this.state.currentPlayers);
    return (
      <WebsocketConsumer channels={this.channels}>
        <AuthView className="create-new-game" title="Create new game">
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
        </AuthView>
      </WebsocketConsumer>
    );
  }
}

export default withRouter(withWebsocketContext(CreateNewGame));