import React from 'react';
import { withRouter } from 'react-router-dom';
import avatar from '../img/avatar.png';
import Avatar from './Avatar';
import { api, handleError } from "../helpers/api";

class UserEntry extends React.Component {

    async accept(username) {
        try {
            await api.get(`/friendrequests/accept`, { params: { 
                senderName: username
            } });
            this.props.refreshUsers()
        } catch (error) {
            console.log(error)
            // catch error?
        }
    }

    async reject(username) {
        try {
            await api.get(`/friendrequests/decline`, { params: { 
                senderName: username
            } });
            this.props.refreshUsers()
        } catch (error) {
            console.log(error)
            // catch error?
        }
    }

    render() {
        let {user, withInvitation} = this.props

        return (
            <div className="user-entry" key={user.username}>
                <Avatar img={avatar} />
                <p className="username">{user.username}</p>
                <p className="email">{user.email}</p>
                {user.category === "received" ? 
                    <p onClick={withInvitation ? () => user.invite() : null} className={"status " + (user.invite ? 'invite' : '')}>{user.status}</p>
                :
                    <React.Fragment>
                        <p onClick={this.accept(user.username)} className="accept">Accept</p>
                        <p onClick={this.reject(user.username)} className="reject">Reject</p>
                    </React.Fragment>
                }
            </div>
        );
    }
}

export default withRouter(UserEntry);






