import React from 'react';
import { withRouter } from 'react-router-dom';
import View from "../View";
import { viewLinks } from "../../helpers/constants";
import NavigationBox from "../../components/NavigationBox"

class Home extends React.Component {

  constructor() {
    super();
    this.state = {
<<<<<<< HEAD
      username: localStorage.getItem("username")
=======
      username: "Sandro"
>>>>>>> 1d7b81c (websocket basic implementation, first test until game screen (#111))
    };
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
              />
              <p className="below-box">or just wait here to get invited</p>
            </div>
            <div className="col">
              <p className="above-box">Want to change your profile?</p>
              <NavigationBox 
                title="Manage Friends"
                subtitle="Connect with your friends"
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

export default withRouter(Home);