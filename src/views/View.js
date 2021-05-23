import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import dog from "../img/dog-transparent.png"
import { withForegroundContext } from '../components/context/ForegroundProvider';
import { withWebsocketContext } from '../components/context/WebsocketProvider';
import Instruction from '../components/overlay/Instruction';
import About from '../components/overlay/About';
import { api, handleError } from "../helpers/api";
import { linksMode } from "../helpers/constants";
import ErrorMessage from '../components/alert/ErrorMessage';
import sessionManager from '../helpers/sessionManager';
import WebsocketConsumer from '../components/context/WebsocketConsumer';

class View extends React.Component {

  constructor(){
    super();
    this.gameId = sessionManager.getGameId();
    this.gameSessionId = sessionManager.getGameSessionId();
    this.onUrlChangedManually = this.onUrlChangedManually.bind(this);
  }
  
  componentDidMount() {
    let documentTitle = "Brändi Dog Online"
    let username = localStorage.getItem("username")
    let prefix = username + " – "
    if(username && !document.title.includes(prefix)) {
      document.title = prefix + documentTitle
    } else if(!username) {
      document.title = documentTitle
    }
  }

  openInstruction() {
    this.props.foregroundContext.openOverlay(<Instruction />);
  }

  openAbout() {
    this.props.foregroundContext.openOverlay(<About />);
  }

  onUrlChangedManually() {
    this.leaveGameIfUrlChangedManually()
    this.leaveGameSessionIfUrlChangedManually()
  }

  leaveGameIfUrlChangedManually() {
    if(!this.props.inGame && sessionManager.getGameId() !== null) {
      this.handleLeaveGame()
    }
  }

  leaveGameSessionIfUrlChangedManually() {
    if(!this.props.inGameSession && sessionManager.getGameSessionId() !== null) {
      this.handleLeaveGameSession()
    }
  }

  handleLeaveGame() {
    this.props.websocketContext.sockClient.send(`/app/game/${this.gameId}/leave`)
    sessionManager.setGameId(null)
    sessionManager.setGameViewPage(null);
  }

  handleLeaveGameSession() {
    // same as in CreateNewGame.js componentWillUnmount()
    this.props.websocketContext.sockClient.send(`/app/game/${this.gameSessionId}/leave`)
    sessionManager.setGameSessionId(null)
  }

  async logout() {
    try {
      await api.post(`/users/logout`);

      localStorage.removeItem('token');
      localStorage.removeItem('username');

      this.props.history.push("/login");
      this.props.websocketContext.disconnect();
    } catch (error) {
      this.props.foregroundContext.showAlert(<ErrorMessage text={handleError(error)}/>, 5000)
    }
  }

  getFooterLink() {
    if(this.props.linksMode === linksMode.IN_GAME) {
      return <Link to="/home" onClick={() => this.handleLeaveGame()}>Leave</Link>
    } else if(this.props.linksMode === linksMode.IN_GAME_SESSION) {
      return <Link to="/home" onClick={() => this.handleLeaveGameSession()}>Leave</Link>
    } else if(this.props.linksMode === linksMode.AUTH) {
      return <a onClick={() => this.logout()}>Logout</a>
    } else {
      return <a onClick={() => this.openAbout()}>About</a>
    }
  }

  render() {
    let { withDogImgHidden, withFooterHidden, className, inGame, title} = this.props;

    return (
      <WebsocketConsumer connectionCallback={this.onUrlChangedManually}>
        <div className={"view " + (inGame ? 'ingame-view' : '')} id="view">
          <div className={"navigation-link header-link"}>
              <a onClick={() => this.openInstruction()}>Instruction</a>
          </div>

          <div className={className}>
            {!withDogImgHidden && <div className="dog-container"><Link to="/home"><img className="dog" src={dog} /></Link></div>}
            {title && <h1 className="title">{title}</h1>}
            {this.props.children}
          </div>
          {!withFooterHidden && <footer><p>Brändi Dog is a card game made by <a target="_blank" href="https://www.braendi.ch/">Stiftung Brändi</a></p></footer>}
          
          <div className={"navigation-link footer-link"}>
            {this.getFooterLink()}
          </div>
        </div>
      </WebsocketConsumer>
    );
  }
}

export default withRouter(withForegroundContext(withWebsocketContext(View)));