import React from 'react';
import { withRouter } from 'react-router-dom';

class WebsocketConnection extends React.Component {

  componentDidMount() {
      console.log("connection mounted")
    /*
    sockClient.onRegister(r => this.handleSocketRegister(r));
    sockClient.onDisconnect(r => this.handleDisconnect(r));
    sockClient.onLobbyMessage('/chat', r => this.handleChatMessage(r));
    sockClient.onLobbyMessage('/lobby-state', r => this.handleLobbyUpdate(r));
    sockClient.onLobbyMessage('/start-game', () => this.handleGameStart());*/

    // if we're rematching, we should still be connected
    /*if (sockClient.isConnected()) {
      sockClient.sendToLobby('/rematch');
    }
    else {
      sockClient.connectAndRegister(this.props.authToken);
    }*/
  }

  componentWillUnmount() {
      console.log("connection unmounted")
    /*
    sockClient.clearDisconnectSubscriptions();
    sockClient.clearMessageSubscriptions();
    if (!sessionManager.inGame) {
        sockClient.disconnect();
    }*/
  }

  render() {
    return (
      this.props.children
    );
  }
}

export default withRouter(WebsocketConnection);