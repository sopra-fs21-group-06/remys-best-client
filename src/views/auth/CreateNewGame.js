import React from 'react';
import { withRouter } from 'react-router-dom';
import View from "../View";
import { viewLinks } from "../../helpers/constants"
import BoxWithUsers from '../../components/BoxWithUsers';
import FriendsFilter from '../../components/FriendsFilter';

class CreateNewGame extends React.Component {

  // TODO align boxes horizontally dynamically with refs and on compDidM
  render() {
    return (
      <View className="create-new-game" title="Create new game" linkMode={viewLinks.BASIC}>
          <main className="large side-by-side">
            <div className="col">
              <p className="above-box">Only friends which are on the home screen can be invited. If you are not friends just send a friend request and wait for the response.</p>
              <div className="friends-filter">
                <FriendsFilter />
              </div>
            </div>
            <div className="col">
              <p className="above-box">After getting invited your friend has 15 seconds to accept your invitation. If the invitation has been accepted it will be marked in the list below, otherwise your friend will be removed. It is possible to invite friends several times in a row or fill your game up with random players.</p>
              <div className="current-players">
                <BoxWithUsers title="Current Players" users={[]}/>
                <div className="link-below-box"><p className="clickable">Fill up with random players</p></div>
              </div>
            </div>
          </main>
      </View>
    );
  }
}

export default withRouter(CreateNewGame);