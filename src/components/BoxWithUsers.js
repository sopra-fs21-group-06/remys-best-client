import React from 'react';
import { withRouter } from 'react-router-dom';
import Box from './Box';
import avatar from '../img/avatar.png';
import Avatar from './Avatar';

class BoxWithUsers extends React.Component {

    constructor() {
        super();
        this.state = {
            filterMode: "friends"
        };
    }

    changeFilterMode(newFilterMode) {
        this.setState({filterMode: newFilterMode})
    }

    render() {
        let {withFilter, users, isSubmitting, title, onClickStatus} = this.props
        let {filterMode} = this.state
        let usersToShow = users.filter(user => {
            return user.category === filterMode
        });

        return (
            <div>
                {
                    withFilter && 
                    <div className="user-filter">
                        <p onClick={() => this.changeFilterMode("friends")} className={filterMode == "friends" ? "active" : ""}>Friends</p>
                        <p onClick={() => this.changeFilterMode("sent")} className={filterMode == "sent" ? "active" : ""}>Pending</p>
                        <p onClick={() => this.changeFilterMode("received")} className={filterMode == "received" ? "active" : ""}>Requests</p>
                    </div>
                }
                {
                    title && 
                    <div className="user-box-title">
                        <p>{title}</p>
                    </div>
                }
                <Box className="with-users">
                    <div className="scrollable">
                        {isSubmitting ? 
                            <div className="loading">
                                <div className="loader-wrapper">
                                    <div className="loader"></div>
                                </div>
                            </div>
                        : 
                        usersToShow.map(user => {
                            return (
                                <div className="user-entry" key={user.username}>
                                    <Avatar img={avatar} />
                                    <p className="username">{user.username}</p>
                                    <p className="email">{user.email}</p>
                                    <p onClick={onClickStatus ? () => onClickStatus(user.username) : null} className="status">{user.status}</p>
                                </div>  
                            );
                        })}
                    </div>
                </Box> 
             </div>
        );
    }
}

export default withRouter(BoxWithUsers);