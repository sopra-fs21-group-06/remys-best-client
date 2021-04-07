import React from 'react';
import { withRouter } from 'react-router-dom';
import ResetPasswordForm from '../../components/form/ResetPasswordForm';
import View from "../View";
import { viewLinks } from "../../helpers/constants"

class ResetPassword extends React.Component {

  render() {
    return (
      <View className="reset-password" title="Reset your password" isDogVisible={true} linkMode={viewLinks.BASIC}>
          <main className="small">
            <ResetPasswordForm />
          </main>
      </View>
    );
  }
}

export default withRouter(ResetPassword);

