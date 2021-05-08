import React from 'react';
import { withRouter } from 'react-router-dom';
import View from "../View";
import { viewLinks } from "../../helpers/constants";
import NavigationBox from "../../components/NavigationBox"
import { withForegroundContext } from '../../components/context/ForegroundProvider';
import { withWebsocketContext } from '../../components/context/WebsocketProvider';
import WebsocketConsumer from '../../components/context/WebsocketConsumer';
import Invitation from '../../components/alert/Invitation';
import { createChannel } from '../../helpers/modelUtils';

class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      username: localStorage.getItem("username"),
    };

    this.channels = [
      createChannel(`/user/queue/invitation`, (msg) => this.handleInvitationMessage(msg)),
      createChannel(`/user/queue/countdown`, (msg) => this.handleCountdownMessage(msg)),
    ]
  }

  componentWillUnmount() {
    this.props.websocketContext.sockClient.send('/app/home/unregister', {});
  }

  register() {
    this.props.websocketContext.sockClient.send('/app/home/register', {});
  }

  handleInvitationMessage(msg) {
    this.props.foregroundContext.openAlert(<Invitation 
      hostName={msg.hostName}
      gameSessionId={msg.gameSessionId}
      closeAlert={this.props.foregroundContext.closeAlert} />
    );
  }

  handleCountdownMessage(msg) {
    this.props.foregroundContext.setCountdown(parseInt(msg.currentCounter))
  }

  async onClickCreateNewGame() {
    /*
    const response = await api.get(`/create-gamesession`);
    let gameSessionId = response.data.gameSessionId
    sessionManager.setGameSessionId(gameSessionId)*/
    this.props.history.push('/create-new-game')
  }

  // todo view withBasicLinks topLeftLink={} bottomRightLink={}
  render() {
    return (
      <WebsocketConsumer channels={this.channels} connectionCallback={() => this.register()}>
        <View title={"Welcome back, " + this.state.username}  linkMode={viewLinks.BASIC}>
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
        </View>
      </WebsocketConsumer>
    );
  }
}

export default withRouter(withForegroundContext(withWebsocketContext(Home)));