import React from 'react';
import { withRouter } from 'react-router-dom';
import RegisterForm from '../../components/form/RegisterForm';
import UnauthView from '../UnauthView';

class Register extends React.Component {

  render() {
    return (
      <UnauthView className="register" title="Create your account">
          <main className="small">
            <RegisterForm />
          </main>
      </UnauthView>
    );
  }
}

export default withRouter(Register);

