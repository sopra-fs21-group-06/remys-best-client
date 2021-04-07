import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import dog from "../img/dog-transparent.png"

class View extends React.Component {

  constructor() {
    super();
    this.state = {
      usernameOrEmail: '',
      errorMessageUsernameOrEmail: null,
      isUsernameOrEmailValid: true,
    };
  }

  render() {
    return (
      <div className="view">
        <div className={"navigation-link header-link"}>
            <Link to={this.props.linkMode.headerLink.to}>{this.props.linkMode.headerLink.name}</Link>
        </div>
        <div className={this.props.className}>
          {this.props.isDogVisible ? <img className="dog" src={dog} /> : null }
          {this.props.title ? <h1 className="title">{this.props.title}</h1> : null }
          {this.props.children}
        </div>
        {this.props.isFooterInvisible ? null : <footer><p>Brändi Dog is a card game made by <a target="_blank" href="https://www.braendi.ch/">Stiftung Brändi</a></p></footer>}
        
        <div className={"navigation-link footer-link"}>
            <Link to={this.props.linkMode.footerLink.to}>{this.props.linkMode.footerLink.name}</Link>
        </div>
      </div>
    );
  }
}

export default withRouter(View);