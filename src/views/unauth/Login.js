import React from 'react';
import { withRouter } from 'react-router-dom';
import LoginForm from '../../components/form/LoginForm';

class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      usernameOrEmail: '',
      errorMessageUsernameOrEmail: null,
      isUsernameOrEmailValid: true,
    };
  }

  /*
  async login() {
    try {
      const requestBody = JSON.stringify({
        username: this.state.username,
        name: this.state.name
      });
      const response = await api.post('/users', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      this.props.history.push(`/game`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  }*/

  render() {
    return (
      <div>
        <LoginForm />
      </div>
    );
  }
}

export default withRouter(Login);



/*


      <div>
<div className="blue-marble"></div>
<div className="green-marble"></div>
<div className="red-marble"></div>
<div className="yellow-marble"></div>
      </div>


      */