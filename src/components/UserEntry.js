import React from 'react';
import { withRouter } from 'react-router-dom';
import avatar from '../img/avatar.png';
import Avatar from './Avatar';
import { api, handleError } from "../helpers/api";
import { userCategories, userStatus } from "../helpers/constants";
import { withWebsocketContext } from './context/WebsocketProvider';
import { withForegroundContext } from './context/ForegroundProvider';
import sessionManager from "../helpers/sessionManager";
import ErrorMessage from './alert/ErrorMessage';

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
            this.props.foregroundContext.showAlert(<ErrorMessage text={handleError(error)}/>, 5000)
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
            this.props.foregroundContext.showAlert(<ErrorMessage text={handleError(error)}/>, 5000)
        }
    }

    inviteUserToGameSession(user) {
        user.setStatus("Invited")
        this.props.websocketContext.sockClient.send(`/app/gamesession/${this.gameSessionId}/invite`, {username: user.getUsername()});
    }

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
                <p className="username">{user.getUsername() === localStorage.getItem("username") ? "You" : user.getUsername()}</p>
                {user.getCategory() === userCategories.RECEIVED ? 
                    <React.Fragment>
                        <p onClick={() => this.acceptFriendRequest(user.getUsername())} className="accept clickable">Accept</p>
                        <p onClick={() => this.rejectFriendRequest(user.getUsername())} className="reject clickable">Reject</p>
                    </React.Fragment>
                :
                    <p onClick={isInvitable ? user.getInvite() : null} className={"status " + (isInvitable ? 'invite' : '')}>{user.getStatus()}</p>
                }
            </div>
        );
    }
}

export default withRouter(withForegroundContext(withWebsocketContext(UserEntry)));






