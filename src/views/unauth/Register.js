import React from 'react';
import { withRouter } from 'react-router-dom';
import RegisterForm from '../../components/form/RegisterForm';

class Register extends React.Component {

  render() {
    return (
      <div>
        <RegisterForm />
      </div>
    );
  }
}

export default withRouter(Register);

