import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import dog from "../img/dog-transparent.png"

// TODO document.title = "In-Game - Frantic";
class View extends React.Component {

  render() {
    let { withDogImgHidden, withFooterHidden} = this.props;

    return (
      <div className="view">
        <div className={"navigation-link header-link"}>
            <Link to={this.props.linkMode.headerLink.to}>{this.props.linkMode.headerLink.name}</Link>
        </div>

        <div className={this.props.className}>
          {!withDogImgHidden && <img className="dog" src={dog} />}
          {this.props.title && <h1 className="title">{this.props.title}</h1>}
          {this.props.children}
        </div>
        {!withFooterHidden && <footer><p>Brändi Dog is a card game made by <a target="_blank" href="https://www.braendi.ch/">Stiftung Brändi</a></p></footer>}
        
        <div className={"navigation-link footer-link"}>
            <Link to={this.props.linkMode.footerLink.to}>{this.props.linkMode.footerLink.name}</Link>
        </div>
      </div>
    );
  }
}

export default withRouter(View);