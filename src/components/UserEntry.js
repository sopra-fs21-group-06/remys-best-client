import React from 'react';
import { withRouter } from 'react-router-dom';
import avatar from '../img/avatar.png';
import Avatar from './Avatar';
import { api, handleError } from "../helpers/api";
import { userCategories, userStatus } from "../helpers/constants";
import { withWebsocketContext } from './context/WebsocketProvider';
import sessionManager from "../helpers/sessionManager";

class UserEntry extends React.Component {

    constructor() {
        super();
        this.gameSessionId = sessionManager.getGameSessionId();
    }

    async acceptFriendRequest(username) {
        try {
            const requestBody = JSON.stringify({
                senderName: username
            });
            await api.post(`/friendrequests/accept`, requestBody);
            this.props.refreshUsers()
        } catch (error) {
            console.log(error)
            // catch error?
        }
    }

    async rejectFriendRequest(username) {
        try {
            const requestBody = JSON.stringify({
                senderName: username
            });
            await api.post(`/friendrequests/decline`, requestBody);
            this.props.refreshUsers()
        } catch (error) {
            console.log(error)
            // catch error?
        }
    }

    inviteUserToGameSession(user) {
        user.setStatus(userStatus.BUSY)
        this.props.websocketContext.sockClient.send(`/app/gamesession/${this.gameSessionId}/invite`, {username: user.getUsername()});
    }

    // TODO myfriends -> on fetch  status = invited in user feedback bacakend side (15s then again to free)
    render() {
        let {user, withInvitation} = this.props

        let isInvitable = withInvitation && (user.getStatus() === userStatus.FREE || user.getStatus() === userStatus.INVITE)
        if(isInvitable) {
            user.setStatus(userStatus.INVITE)
            user.setInvite(() => this.inviteUserToGameSession(user))
        }

        return (
            <div className="user-entry">
                <Avatar img={avatar} />
                <p className="username">{user.getUsername()}</p>
                <p className="email">{user.getEmail()}</p>
                {user.getCategory() === userCategories.RECEIVED && user.getCategory!==userCategories.ACCEPTED ? 
                    <React.Fragment>
                        <p onClick={() => this.acceptFriendRequest(user.getUsername())} className="accept clickable">Accept</p>
                        <p onClick={() => this.rejectFriendRequest(user.getUsername())} className="reject clickable">Reject</p>
                    </React.Fragment>
                :
                    <p onClick={isInvitable ? user.getInvite() : null} className={"status " + (isInvitable ? 'invite' : '')}>{user.getStatus()}</p>
                }
                {user.getCategory()=== userCategories.ACCEPTED ?
                    null
                : null
                }
            </div>
        );
    }
}

export default withRouter(withWebsocketContext(UserEntry));






