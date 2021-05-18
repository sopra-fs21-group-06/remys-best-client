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
      createChannel(`/topic/game/${this.gameId}/game-end`,(msg)=> this.handlePlayerDisconnection(msg))
    ]
  }
  
  handlePlayerDisconnection(msg) {
    if(msg.aborted!=null) {
      this.props.history.push({pathname: '/game-end', state: {usernameWhichHasLeft: msg.aborted, mode:'aborted'}})
    } else if(this.getMyPlayerName in msg.won){
      this.props.history.push({pathname: '/game-end', state: { mode:'won'}})
    } else{
      this.props.history.push({pathname: '/game-end', state: { mode:'lost'}})
    }
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