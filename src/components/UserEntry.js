import React from 'react';
import { withRouter } from 'react-router-dom';
import avatar from '../img/avatar.png';
import Avatar from './Avatar';
import { api, handleError } from "../helpers/api";

class UserEntry extends React.Component {

    async accept(username) {
        try {
            const requestBody = JSON.stringify({
                senderName: username
            });
            await api.post(`/friendrequests/accept`, requestBody);
            setTimeout(() => {this.props.refreshUsers()}, 1000);
        } catch (error) {
            console.log(error)
            // catch error?
        }
    }

    async reject(username) {
        try {
            const requestBody = JSON.stringify({
                senderName: username
            });
            await api.post(`/friendrequests/decline`, requestBody);
            setTimeout(() => {this.props.refreshUsers()}, 1000);
        } catch (error) {
            console.log(error)
            // catch error?
        }
    }

    render() {
        let {user, withInvitation} = this.props

        return (
            <div className="user-entry">
                <Avatar img={avatar} />
                <p className="username">{user.getUsername()}</p>
                <p className="email">{user.getEmail()}</p>
                {user.getCategory() === "received" ? 
                    <React.Fragment>
                        <p onClick={() => this.accept(user.getUsername())} className="accept clickable">Accept</p>
                        <p onClick={() => this.reject(user.getUsername())} className="reject clickable">Reject</p>
                    </React.Fragment>
                :
                    <p onClick={withInvitation ? () => user.getInvite()() : null} className={"status " + (user.getInvite() ? 'invite' : '')}>{user.getStatus()}</p>
                }
            </div>
        );
    }
}

export default withRouter(UserEntry);






