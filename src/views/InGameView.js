import React from 'react';
import { withRouter } from 'react-router-dom';
import { linksMode } from '../helpers/constants';
import View from './View';
import { createChannel } from '../helpers/modelUtils';
import sessionManager from "../helpers/sessionManager";
import WebsocketConsumer from '../components/context/WebsocketConsumer';

class InGameView extends React.Component {
  constructor(){
    super();
    this.gameId = sessionManager.getGameId();
    this.channels = [
      createChannel(`/topic/game/${this.gameId}/game-end`,(msg)=> this.handleGameEndMessage(msg))
    ]
  }
  
  handleGameEndMessage(msg) {
    this.props.history.push({pathname: '/game-end', state: {gameEndMessage: msg}})
  }

  render() {
    return (
      <WebsocketConsumer channels={this.channels}>
        <View {...this.props} linksMode={linksMode.IN_GAME} withFooterHidden withDogImgHidden inGame/>
      </WebsocketConsumer>
    );
  }
}

export default withRouter(InGameView);