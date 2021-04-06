import React from 'react';
import { withRouter } from 'react-router-dom';

class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      name: null,
      username: "Sandro"
    };
  }

  render() {
    return (
      <div className="login">
        <p>Login</p>
      </div>
    );
  }
}

export default withRouter(Login);