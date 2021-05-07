import React from 'react';
import { withRouter } from 'react-router-dom';
import View from "../View";
import { viewLinks } from "../../helpers/constants";
import NavigationBox from "../../components/NavigationBox"
import { withForegroundContext } from '../../components/context/ForegroundProvider';

class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      username: localStorage.getItem("username")
    };
  }

  openAlert() {
    this.props.foregroundContextValue.showAlert(<p>foo</p>, 5000);
  }

  // todo view withBasicLinks topLeftLink={} bottomRightLink={}
  render() {
    return (
      <View title={"Welcome back, " + this.state.username}  linkMode={viewLinks.BASIC}>
        <main className="large side-by-side">
            <div className="col">
              <p className="above-box">How do you want to play Brändi Dog?</p>
              <NavigationBox 
                title="Single Player"
                subtitle="Play with random people"
                onClick={() => this.props.history.push('/waiting-room')}
              />
              <NavigationBox 
                title="Create New Game"
                subtitle="Play with your friends"
                onClick={() => this.props.history.push('/create-new-game')}
              />
              <p className="below-box">or just wait here to get invited</p>
              <p onClick={() => this.openAlert()}>open alert</p>
            </div>
            <div className="col">
              <p className="above-box">Want to change your profile?</p>
              <NavigationBox 
                title="Manage Friends"
                subtitle="Connect with your friends"
                onClick={() => this.props.history.push('/manage-friends')}
              />
              <NavigationBox 
                title="Edit Profile"
                subtitle="Change your profile data"
                onClick={() => this.props.history.push('/edit-profile')}
              />
            </div>
          </main>
      </View>
    );
  }
}

export default withRouter(withForegroundContext(Home));