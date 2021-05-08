import React from 'react';
import { withRouter } from 'react-router-dom';
import { createSockClient } from "../../helpers/SockClientRemy";

export const WebsocketContext = React.createContext();

export const withWebsocketContext = WrappedComponent => props => (
    <WebsocketContext.Consumer>
        {value => <WrappedComponent {...props} websocketContext={value}/>}
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

  // passed to websocket consumer
  handleSubscribe(channels) {
    channels.forEach(channel => { 
      this.subscribe(channel) 
    })
  }

  // passed to websocket consumer
  handleUnsubscribe(channels) {
    channels.forEach(channel => {
      this.unsubscribe(channel)
    })
  }

  render() {
    return (
      <WebsocketContext.Provider value={this.state}>
          {this.props.children}       
      </WebsocketContext.Provider>
    );
  }
}

export default withRouter(WebsocketProvider);