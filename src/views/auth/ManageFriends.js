import React from 'react';
import { withRouter } from 'react-router-dom';
import View from "../View";
import { viewLinks } from "../../helpers/constants";
import ManageFriendsForm from '../../components/form/ManageFriendsForm';

class ManageFriends extends React.Component {

  constructor() {
    super();
    this.state = {
      //username: localStorage.getItem("username")
    };
  }

  // todo view withBasicLinks topLeftLink={} bottomRightLink={}
  render() {
    return (
      <View className="manage-friends" title="Manage Friends" linkMode={viewLinks.BASIC}>
        <main className="middle">
           <ManageFriendsForm />
        </main>
      </View>
    );
  }
}

export default withRouter(ManageFriends);

//  <ManageFriendsForm />