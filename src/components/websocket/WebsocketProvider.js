import React from 'react';
import { withRouter } from 'react-router-dom';
import { createSockClient } from "../../helpers/SockClientRemy";
<<<<<<< HEAD
import { createChannel } from '../../helpers/modelUtils';
=======
>>>>>>> dev

export const WebsocketContext = React.createContext();

export const withWebsocketContext = WrappedComponent => props => (
    <WebsocketContext.Consumer>
        {value => <WrappedComponent {...props} contextValue={value}/>}
    </WebsocketContext.Consumer>
);

/**
 * This component manages the websocket session, holds the currently subscribed channels 
 * and represents a parent for all view components which are based on a websocket connection
 */
class WebsocketProvider extends React.Component {

  constructor() {
    super();
    this.state = {
      sockClient: createSockClient(),
      isConnected: false,
      handleSubscribe: (channels) => {
        this.handleSubscribe(channels)
      },
      handleUnsubscribe: (channels) => {
        this.handleUnsubscribe(channels)
      },
      connect: () => {
        this.connect()
      }
    };    
    this.subscribedChannels = [];
  }

  componentDidMount() {
    if(this.props.isAuthOnMount) {
      this.connect();
    }
  }

  componentWillUnmount() {
    if(this.state.isConnected) {
      this.disconnect();
    }
  }

  connect() {
    const onConnected = () => {
      this.setState({isConnected: true})
<<<<<<< HEAD
      let myPrivateChannel = createChannel("/user/queue/private", (msg) => this.handlePrivateMessage(msg))
      this.subscribe(myPrivateChannel)
=======
>>>>>>> dev
    }
    this.state.sockClient.connect(() => onConnected());
  }

  disconnect() {
    this.state.sockClient.disconnect();
  }

  subscribe(channelToSubscribe) {
    let response = this.state.sockClient.subscribe(channelToSubscribe.getName(), channelToSubscribe.getCallback());
    channelToSubscribe.setUnsubscribe(response.unsubscribe)
    this.subscribedChannels.push(channelToSubscribe)
  }

  unsubscribe(channelToUnsubscribe) {
    channelToUnsubscribe.getUnsubscribe()()
    this.subscribedChannels = this.subscribedChannels.filter(channel => { 
        return channel.getName() !== channelToUnsubscribe.getName(); 
    });
  }

<<<<<<< HEAD
=======
  // passed to websocket consumer
>>>>>>> dev
  handleSubscribe(channels) {
    channels.forEach(channel => { 
      this.subscribe(channel) 
    })
  }

<<<<<<< HEAD
=======
  // passed to websocket consumer
>>>>>>> dev
  handleUnsubscribe(channels) {
    channels.forEach(channel => {
      this.unsubscribe(channel)
    })
  }

<<<<<<< HEAD
  handlePrivateMessage() {
    // TODO: filter the message depending on the private message type and switch/case the types
    console.log("private message received")

    // TODO if message has type user is added to new game (4 players in waiting room), then redirect to the choose place screen with the game id
    // this.props.history.push({pathname: '/choose-place', state: {gameId: '<uuid received from server>'}})
  }

=======
>>>>>>> dev
  render() {
    return (
      <WebsocketContext.Provider value={this.state}>
          {this.props.children}       
      </WebsocketContext.Provider>
    );
  }
}

export default withRouter(WebsocketProvider);