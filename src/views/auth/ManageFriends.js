import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import FriendRequestForm from '../../components/form/FriendRequestForm';
import FriendsFilter from '../../components/FriendsFilter';
import AuthView from '../AuthView';

class ManageFriends extends React.Component {

   constructor(props) {
      super(props);
      this.friendsFilterRef = React.createRef();
      this.refreshUsers = this.refreshUsers.bind(this)
   }

   refreshUsers() {
     this.friendsFilterRef.current.refreshUsers()
   }

    // todo view withBasicLinks topLeftLink={} bottomRightLink={}
    render() {
      return (
        <AuthView className="manage-friends" title="Manage Friends">
          <main className="middle">
              <div className="friends-filter" >
                <FriendsFilter ref={this.friendsFilterRef}/>
              </div>
              <div className="friend-request">
                <p>You want to add new friends? Just type in the username and send a friend request</p>
                <FriendRequestForm refreshUsers={this.refreshUsers}/>
              </div>
              <p className="below-btn"><Link to="/home">Return to Home</Link></p>
          </main>
        </AuthView>
      );
    }
}

export default withRouter(ManageFriends);