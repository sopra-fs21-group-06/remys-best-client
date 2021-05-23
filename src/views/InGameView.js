import React from 'react';
import { withRouter } from 'react-router-dom';
import { linksMode } from '../helpers/constants';
import View from './View';
import { createChannel } from '../helpers/modelUtils';
import sessionManager from "../helpers/sessionManager";
import WebsocketConsumer from '../components/context/WebsocketConsumer';
import { withWebsocketContext } from '../components/context/WebsocketProvider';

class InGameView extends React.Component {
  constructor(){
    super();
    this.gameId = sessionManager.getGameId();
    this.channels = [
      createChannel(`/topic/game/${this.gameId}/game-end`,(msg)=> this.handleGameEndMessage(msg))
    ]
    this.handleReload = this.handleReload.bind(this)
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleUnload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload);
  }

  handleReload() {
    let {pathname} = this.props.location
    if(sessionManager.getGameViewPage() === pathname) {
      this.props.websocketContext.sockClient.send(`/app/game/${this.gameId}/leave`)
      this.props.history.push('/home')
      return
    }
    sessionManager.setGameViewPage(pathname);
  }

  handleUnload(event) {
    const e = event || window.event;
    // Cancel the event
    e.preventDefault();
    if (e) {
      e.returnValue = ''; // Legacy method for cross browser support
    }
    return ''; // Legacy method for cross browser support
  }
  
  handleGameEndMessage(msg) {
    this.props.history.push({pathname: '/game-end', state: {gameEndMessage: msg}})
  }

  render() {
    return (
      <WebsocketConsumer channels={this.channels} connectionCallback={this.handleReload}>
        <View {...this.props} linksMode={linksMode.IN_GAME} withFooterHidden withDogImgHidden inGame/>
      </WebsocketConsumer>
    );
  }
}

export default withRouter(withWebsocketContext(InGameView));