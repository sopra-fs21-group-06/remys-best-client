import React from 'react';
import { withRouter } from 'react-router-dom';
import LoginForm from '../../components/form/LoginForm';
import View from "../View";
import { viewLinks } from "../../helpers/constants"

class Login extends React.Component {

  render() {
    return (
      <View className="login" isDogVisible={true} linkMode={viewLinks.BASIC}>
          <main className="large side-by-side">
            <div className="col">
              <h1>Welcome to Brändi Dog Online</h1>
              <p>Brändi Dog is an exciting board game that is played in two opponent teams and with bridge cards. The goal is to get your own marbles from the kennel to the finish zone.</p>
              <br/>
              <p>The cards you draw determine how you move forward. You are supported by your team partner and sent home by the other party. The winner is the team that cleverly teams up and is the first to bring the marbles to the finish zone.</p>
              <br/>
              <p>Sign up an play Brändi Dog online!</p>
            </div>
            <div className="col">
              <h1>Sign in to your account</h1>
              <LoginForm />
            </div>
          </main>
      </View>
    );
  }
}

export default withRouter(Login);