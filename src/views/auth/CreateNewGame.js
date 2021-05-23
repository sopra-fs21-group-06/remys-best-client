import React from 'react';
import { withRouter } from 'react-router-dom';
import BoxWithUsers from '../../components/BoxWithUsers';
import FriendsFilter from '../../components/FriendsFilter';
import sessionManager from "../../helpers/sessionManager";
import WebsocketConsumer from '../../components/context/WebsocketConsumer';
import { createChannel, createUser } from '../../helpers/modelUtils';
import { withWebsocketContext } from '../../components/context/WebsocketProvider';
import { userCategories } from '../../helpers/constants';
import View from '../View';
import { linksMode } from '../../helpers/constants';
import ErrorMessage from '../../components/alert/ErrorMessage';
import { withForegroundContext } from '../../components/context/ForegroundProvider';

class CreateNewGame extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentPlayers: [],
    };

    this.friendsFilterRef = React.createRef();
    this.gameSessionId = sessionManager.getGameSessionId();
    this.channels = [
      createChannel(`/topic/gamesession/${this.gameSessionId}/gamesession-end`, (msg) => this.handleGameSessionEndMessage(msg)),
      createChannel(`/topic/gamesession/${this.gameSessionId}/invited-user`, (msg) => this.handleInvitedUserMessage(msg)),
      createChannel(`/topic/gamesession/${this.gameSessionId}/countdown`, (msg) => this.handleCountdownMessage(msg)),
      createChannel(`/topic/gamesession/${this.gameSessionId}/accepted`,(msg) => this.handleAcceptedUserMessage(msg)),
      createChannel(`/user/queue/gamesession/${this.gameSessionId}/ready`, (msg) => this.handleGameReadyMessage(msg)),
      createChannel(`/user/queue/gamesession/error/invite`, (msg) => this.handleErrorMessage(msg)),
      createChannel(`/user/queue/gamesession/error/fill-up`, (msg) => this.handleErrorMessage(msg)),
    ]
    this.onConnectionEstablished = this.onConnectionEstablished.bind(this)
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleUnload);
  }


  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload);

    // same as in View handleLeaveGameSession()
    this.props.websocketContext.sockClient.send(`/app/gamesession/${this.gameSessionId}/leave`);
    sessionManager.setGameSessionId(null);
  }

  onConnectionEstablished() {
    this.accept(); // accept upon entering the view
    this.handleReload();
  }

  accept() {
    this.props.websocketContext.sockClient.send(`/app/gamesession-request/${this.gameSessionId}/accept`);
  }

  handleReload() {
    if(sessionManager.getGameSessionId() === null) {
      this.props.history.push('/home')
    }
  }

  handleUnload(event) {
    const e = event || window.event;
    // Cancel the event
    e.preventDefault();
    if (e) {
      e.returnValue = ''; // Legacy method for cross browser support
    }
    sessionManager.setGameSessionId(null);
    return ''; // Legacy method for cross browser support
  }

  handleGameSessionEndMessage(msg) {
    this.props.history.push({pathname: '/game-end', state: {gameEndMessage: {aborted: msg.username}}})
  }

  handleInvitedUserMessage(msg) {
    let invitedUsers = msg.invitedUsers.map(invitedUser => {
      return createUser(invitedUser.username, null, userCategories.INVITED)
    })

    let currentPlayersWithoutInvitedOnes = this.state.currentPlayers.filter(player => {
      return player.getCategory() !== userCategories.INVITED
    })
   
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

  handleAcceptedUserMessage(msg){
    let acceptedUsers = msg.acceptedUsers.map(acceptedUser => {
      return createUser(acceptedUser.username, "Accepted", userCategories.ACCEPTED)
    })
    let currentPlayersWithoutAcceptedOnes = this.state.currentPlayers.filter(player => {
      return player.getCategory() !== userCategories.ACCEPTED
    })

    this.setState({currentPlayers: currentPlayersWithoutAcceptedOnes.concat(acceptedUsers)});

    // reload friends filter states
    this.friendsFilterRef.current.refreshUsers()
  }

  handleErrorMessage(msg){
    let errorMessage = msg.msg
    this.props.foregroundContext.showAlert(<ErrorMessage text={errorMessage}/>, 5000) 
    // reload friends filter states
    this.friendsFilterRef.current.refreshUsers()
  }

  fillUpWithRandomPlayers() {
    this.props.websocketContext.sockClient.send(`/app/gamesession/${this.gameSessionId}/fill-up`);
  }

  handleGameReadyMessage(msg){
    sessionManager.setGameId(msg.gameId)
    this.props.history.push({pathname: '/choose-place', state: {players: msg.players}})
  }

  render() {
    return (
      <WebsocketConsumer channels={this.channels} connectionCallback={this.onConnectionEstablished}>
        <View className="create-new-game" title="Create new game" linksMode={linksMode.IN_GAME_SESSION} inGameSession>
            <main className="large side-by-side">
              <div className="col">
                <p className="above-box">Only friends which are on the home screen can be invited. If you are not friends just send a friend request and wait for the response.</p>
                <div className="friends-filter">
                  <FriendsFilter withInvitation ref={this.friendsFilterRef}/>
                </div>
              </div>
              <div className="col">
                <p className="above-box">After getting invited your friend has 15 seconds to accept your invitation. If the invitation has been accepted it will be marked in the list below, otherwise your friend will be removed. It is possible to invite friends several times in a row or fill your game up with random players.</p>
                <div className="current-players">
                  <BoxWithUsers title="Current Players" users={this.state.currentPlayers} />
                  {this.state.currentPlayers[0] && this.state.currentPlayers[0].getUsername() === localStorage.getItem("username") && 
                    <div className="link-below-box"><p className="clickable" onClick={() => this.fillUpWithRandomPlayers()}>Fill up with random players</p></div>
                  }
                </div>
              </div>
            </main>
        </View>
      </WebsocketConsumer>
    );
  }
}

export default withRouter(withForegroundContext(withWebsocketContext(CreateNewGame)));