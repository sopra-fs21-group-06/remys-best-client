import React from 'react';
import { withRouter } from 'react-router-dom';
import { createSockClient } from "../helpers/SockClientRemy";

export const WebsocketContext = React.createContext();

export const withWebsocketContext = WrappedComponent => props => (
    <WebsocketContext.Consumer>
        {value => <WrappedComponent {...props} contextValue={value}/>}
    </WebsocketContext.Consumer>
);

/**
 * This component manages the websocket session and represents a
 * parent for all view components which are based on a websocket connection
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
      }
    };    
    this.channels = [];
  }

  componentDidMount() {
    this.state.sockClient.connect(() => this.setState({isConnected: true}));
  }

  componentWillUnmount() {
    this.state.sockClient.disconnect();
  }

  handleSubscribe(channels) {
    channels.forEach(channel => {
      let subscribedChannel = this.state.sockClient.subscribe(channel.getName(), channel.getCallback());
      channel.setUnsubscribe(subscribedChannel.unsubscribe)
      this.channels.push(channel)
    })
  }

  handleUnsubscribe(channels) {
    let channelsToUnsubscribe = this.channels.filter(c => {
      if(channels.find(channel => c.getName() == channel.getName())) {
        return true
      }
    })

    channelsToUnsubscribe.forEach(channel => {
      channel.getUnsubscribe()()
      this.channels = this.channels.filter(c => { 
          return c.getName() === channel.getName(); 
      });
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