import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import View from "../View";
import { viewLinks } from "../../helpers/constants";
import Avatar from "../../components/Avatar"
import Box from '../../components/Box';
import avatar from '../../img/avatar.png'
import { WebsocketContext } from '../../components/websocket/WebsocketProvider';
import WebsocketConsumer from '../../components/websocket/WebsocketConsumer';
import { createChannel } from '../../helpers/modelUtils';
<<<<<<< HEAD
import { setGameId } from "../../helpers/sessionManager";
=======
import sessionManager from "../../helpers/sessionManager";
>>>>>>> dev

class WaitingRoom extends React.Component {

  static contextType = WebsocketContext;

  constructor() {
    super();
    this.state = {
      currentUsers: []
    };

    this.channels = [
      createChannel('/topic/waiting-room', (msg) => this.handleWaitingRoomMessage(msg)),
      createChannel("/user/queue/waiting-room", (msg) => this.handlePrivateMessage(msg))
    ]
  }
<<<<<<< HEAD

  // TODO wait for isConnected, on reload or first screen
  async componentDidMount() {
    // TODO rewrite
    await new Promise(
      resolve => setTimeout(resolve, 300)
    )
    let isConnected = await this.context.isConnected
    console.log(isConnected)
    this.context.sockClient.send('/app/waiting-room/register', {}); // token is sent implicitly
  }
  
  componentWillUnmount() {
    this.context.sockClient.send('/app/waiting-room/unregister', {}); // token is sent implicitly
  }

  handleWaitingRoomMessage(msg) {
    this.setState({
      currentUsers: msg.currentUsers
    })
  }

  handlePrivateMessage(msg) {
    setGameId(msg.gameId)
=======
  
  componentWillUnmount() {
    this.context.sockClient.send('/app/waiting-room/unregister', {});
  }

  register() {
    this.context.sockClient.send('/app/waiting-room/register', {});
  }

  handleWaitingRoomMessage(msg) {
    this.setState({ currentUsers: msg.currentUsers })
  }

  handlePrivateMessage(msg) {
    sessionManager.setGameId(msg.gameId)
>>>>>>> dev
    this.props.history.push({pathname: '/choose-place', state: {players: msg.players}})
  }

  render() {
    return (
<<<<<<< HEAD
      <WebsocketConsumer channels={this.channels}>
=======
      <WebsocketConsumer channels={this.channels} connectionCallback={() => this.register()}>
>>>>>>> dev
        <View className="waiting-room" title="Waiting Room"  linkMode={viewLinks.BASIC}>
          <main className="small">
              <p className="above-box">As soon as four players are ready, a new game will automatically be started. You could also be picked from an existing game session to fill up their game</p>      
              <div className="queue">
                <p className="above-players">You are in the second place</p>
                <Box className="players">
                  {this.state.currentUsers.map(user => {
                    return <Avatar key={user.username} img={avatar}/>
                  })}
                </Box>
                <p className="below-players"><Link to="/home">Leave and return to Home</Link></p>
              </div>
            </main>
        </View>
      </WebsocketConsumer>
    );
  }
}

export default withRouter(WaitingRoom);