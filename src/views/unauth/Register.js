import React from 'react';
import { withRouter } from 'react-router-dom';
import RegisterForm from '../../components/form/RegisterForm';
import View from "../View";
import { viewLinks } from "../../helpers/constants"

class Register extends React.Component {

  render() {
    return (
      <View className="register" title="Create your account" isDogVisible={true} linkMode={viewLinks.BASIC}>
          <main className="small">
            <RegisterForm />
          </main>
      </View>
    );
  }
}

export default withRouter(Register);

