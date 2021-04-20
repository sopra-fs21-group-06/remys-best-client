import React from 'react';
import { withRouter } from 'react-router-dom';
import { createSockClient } from "../helpers/SockClientRemy";

export const WebsocketContext = React.createContext();

export const withWebsocket = WrappedComponent => props => (
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
      let response = this.state.sockClient.subscribe(channel.getName(), channel.getCallback());
      channel.setUnsubscribe(response.unsubscribe)
      this.channels.push(channel)
    })
  }

  handleUnsubscribe(channels) {
    let channelsToUnsubscribe = this.channels.filter(channel => {
      for(let i = 0; i < channels.length; i++) {
        if(channels[i].getName() === channel.getName()) {
          return true
        }
      }
    })

    channelsToUnsubscribe.forEach(channel => {
      channel.getUnsubscribe()()
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