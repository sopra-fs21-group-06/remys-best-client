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

class WaitingRoom extends React.Component {

  static contextType = WebsocketContext;

  constructor() {
    super();
    this.state = {
      users: ['testUser1']
    };

    this.channels = [
      createChannel('/topic/register', (msg) => this.handleWaitingRoomMessage(msg)),
      createChannel('/topic/waiting-room', (msg) => this.handleWaitingRoomMessage(msg))
    ]
  }

  handleWaitingRoomMessage(msg) {
    console.log("received message from server through /topic/waiting-room")
    console.log(msg)
    // TODO update state users with current users on message received
  }

  sendMsg() {
    this.context.sockClient.send('/app/register', {message: "Hello from the waiting room"});
  }

  render() {
    return (
      <WebsocketConsumer channels={this.channels}>
        <View className="waiting-room" title="Waiting Room"  linkMode={viewLinks.BASIC}>
          <main className="small">
              <p onClick={() => this.sendMsg()}>send message</p>
              <p className="above-box">As soon as four players are ready, a new game will automatically be started. You could also be picked from an existing game session to fill up their game</p>      
              <div className="queue">
                <p className="above-players">You are in the second place</p>
                <Box className="players">
                  {this.state.users.map((index, user) => {
                    return <Avatar key={index} img={avatar}/>
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