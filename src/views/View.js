import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import dog from "../img/dog-transparent.png"
import { withForegroundContext } from '../components/context/ForegroundProvider';
import { withWebsocketContext } from '../components/context/WebsocketProvider';
import Instruction from '../components/overlay/Instruction';
import About from '../components/overlay/About';
import { api } from "../helpers/api";
import { linksMode } from "../helpers/constants";

// TODO document.title = "In-Game - Frantic";
class View extends React.Component {

  openInstruction() {
    this.props.foregroundContext.openOverlay(<Instruction />);
  }

  openAbout() {
    this.props.foregroundContext.openOverlay(<About />);
  }

  async logout() {
    try {
      await api.post(`/users/logout`);

      // remove the token into the local storage.
      localStorage.removeItem('token');
      localStorage.removeItem('username');

      this.props.history.push("/login");
      this.props.websocketContext.disconnect();
    } catch (error) {
      return error;
    }
  }

  getFooterLink() {
    if(this.props.linksMode === linksMode.IN_GAME) {
      return <Link to="/home">Leave</Link>
    } else if(this.props.linksMode === linksMode.AUTH) {
      return <a onClick={() => this.logout()}>Logout</a>
    } else {
      return <a onClick={() => this.openAbout()}>About</a>
    }
  }

  render() {
    let { withDogImgHidden, withFooterHidden} = this.props;

    return (
      <div className="view">
        <div className={"navigation-link header-link"}>
            <a onClick={() => this.openInstruction()}>Instruction</a>
        </div>

        <div className={this.props.className}>
          {!withDogImgHidden && <img className="dog" src={dog} />}
          {this.props.title && <h1 className="title">{this.props.title}</h1>}
          {this.props.children}
        </div>
        {!withFooterHidden && <footer><p>Brändi Dog is a card game made by <a target="_blank" href="https://www.braendi.ch/">Stiftung Brändi</a></p></footer>}
        
        <div className={"navigation-link footer-link"}>
          {this.getFooterLink()}
        </div>
      </div>
    );
  }
}

export default withRouter(withForegroundContext(withWebsocketContext(View)));