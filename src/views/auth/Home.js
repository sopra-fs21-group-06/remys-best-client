import React from 'react';
import { withRouter } from 'react-router-dom';
import NavigationBox from "../../components/NavigationBox"
import sessionManager from "../../helpers/sessionManager";
import { withBackgroundContext } from '../../components/context/BackgroundProvider';
import { withForegroundContext } from '../../components/context/ForegroundProvider';
import { withWebsocketContext } from '../../components/context/WebsocketProvider';
import WebsocketConsumer from '../../components/context/WebsocketConsumer';
import Invitation from '../../components/alert/Invitation';
import { createChannel } from '../../helpers/modelUtils';
import { api, handleError } from '../../helpers/api';
import AuthView from '../AuthView';
import ErrorMessage from '../../components/alert/ErrorMessage';

class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      username: localStorage.getItem("username"),
    };

    this.invitationRef = React.createRef();

    this.channels = [
      createChannel(`/user/queue/home/invitation`, (msg) => this.handleInvitationMessage(msg)),
      createChannel(`/user/queue/home/invitation/countdown`, (msg) => this.handleCountdownMessage(msg)),
    ]
  }

  componentDidMount() {
    this.props.backgroundContext.dispatch({type: `BLUE-bottom`})
  }

  componentWillUnmount() {
    if(this.invitationRef.current) {
      this.invitationRef.current.reject()
    }
    this.props.websocketContext.sockClient.send('/app/home/unregister');
  }

  register() {
    this.props.websocketContext.sockClient.send('/app/home/register');
  }

  handleInvitationMessage(msg) {
    this.props.foregroundContext.openAlert(<Invitation 
      ref={this.invitationRef}
      hostName={msg.hostName}
      gameSessionId={msg.gameSessionId}
      closeAlert={this.props.foregroundContext.closeAlert} 
      websocketContext={this.props.websocketContext}
      history={this.props.history}
      />
    );
    this.props.foregroundContext.setAlertCountdown(null)
  }

  handleCountdownMessage(msg) {
    let countdown = parseInt(msg.currentCounter)

    if(countdown <= 0 && this.invitationRef.current) {
      this.invitationRef.current.reject()
    } else {
      this.props.foregroundContext.setAlertCountdown(countdown)
    }
  }

  async onClickCreateNewGame() {
    try {
      const response = await api.get(`/create-gamesession`);
      let gameSessionId = response.data.gameSessionId
      sessionManager.setGameSessionId(gameSessionId)
      this.props.history.push('/create-new-game')
    } catch (error) {
      this.props.foregroundContext.showAlert(<ErrorMessage text={handleError(error)}/>, 5000)
    }
  }

  render() {
    return (
      <WebsocketConsumer channels={this.channels} connectionCallback={() => this.register()}>
        <AuthView title={"Welcome back, " + this.state.username}>
          <main className="large side-by-side">
              <div className="col">
                <p className="above-box">How do you want to play Brändi Dog?</p>
                <NavigationBox 
                  title="Single Player"
                  subtitle="Play with random people"
                  onClick={() => this.props.history.push('/waiting-room')}
                />
                <NavigationBox 
                  title="Create New Game"
                  subtitle="Play with your friends"
                  onClick={() => this.onClickCreateNewGame()}
                />
                <p className="below-box">or just wait here to get invited</p>
              </div>
              <div className="col">
                <p className="above-box">Want to change your profile?</p>
                <NavigationBox 
                  title="Manage Friends"
                  subtitle="Connect with your friends"
                  onClick={() => this.props.history.push('/manage-friends')}
                />
                <NavigationBox 
                  title="Edit Profile"
                  subtitle="Change your profile data"
                  onClick={() => this.props.history.push('/edit-profile')}
                />
              </div>
            </main>
        </AuthView>
      </WebsocketConsumer>
    );
  }
}

export default withRouter(withBackgroundContext(withForegroundContext(withWebsocketContext(Home))));