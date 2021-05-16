import React from 'react';
import { withRouter } from 'react-router-dom';
import ResetPasswordForm from '../../components/form/ResetPasswordForm';
import UnauthView from '../UnauthView';

class ResetPassword extends React.Component {

  render() {
    return (
      <UnauthView className="reset-password" title="Reset your password">
          <main className="small">
            <ResetPasswordForm />
          </main>
      </UnauthView>
    );
  }
}

export default withRouter(ResetPassword);

