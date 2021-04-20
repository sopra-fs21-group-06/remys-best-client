import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import View from "../View";
import { viewLinks } from "../../helpers/constants";
import Avatar from "../../components/Avatar"
import Box from '../../components/Box';
import avatar from '../../img/avatar.png'
import { WebsocketContext, withWebsocket } from '../WebsocketProvider';
import WebsocketConsumer from '../WebsocketConsumer';
import { createChannel } from '../../helpers/modelUtils';

class WaitingRoom extends React.Component {

  static contextType = WebsocketContext;

  constructor() {
    super();

    let channels = []
    channels.push(createChannel('/topic/register', (msg) => this.handleRegisterMessage(msg)))
    this.channelsToSubscribe = channels
  }

  handleRegisterMessage(msg) {
    console.log("received from server through topic/register ")
    console.log(msg)
  }

  sendMsg() {
    this.context.sockClient.send('/app/register', {token: "Hello from the waiting room"});
  }

  render() {
    return (
      <WebsocketConsumer channelsToSubscribe={this.channelsToSubscribe}>
        <View className="waiting-room" title="Waiting Room"  linkMode={viewLinks.BASIC}>
          <main className="small">
              <p onClick={() => this.sendMsg()}>send message</p>
              <p className="above-box">As soon as four players are ready, a new game will automatically be started. You could also be picked from an existing game session to fill up their game</p>      
              <div className="queue">
                <p className="above-players">You are in the second place</p>
                <Box className="players">
                  <Avatar />
                  <Avatar />
                  <Avatar />
                  <Avatar img={avatar}/>
                </Box>
                <p className="below-players"><Link to="/home">Leave and return to Home</Link></p>
                <p className="below-players"><Link to="/choose-place">Choose Place</Link></p>
              </div>
            </main>
        </View>
      </WebsocketConsumer>
    );
  }
}

export default withRouter(WaitingRoom);