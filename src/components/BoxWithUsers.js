import React from 'react';
import { withRouter } from 'react-router-dom';
import Box from './Box';
import UserEntry from './UserEntry';

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
        let {withFilter, users, isSubmitting, title, withInvitation, refreshUsers} = this.props
        let {filterMode} = this.state
        let usersToShow = users.filter(user => {
            return user.getCategory() === filterMode
        });

        return (
            <div>
                {
                    withFilter && 
                    <div className="user-filter">
                        <p onClick={() => this.changeFilterMode("friends")} className={filterMode == "friends" ? "active" : ""}>Friends</p>
                        <p onClick={() => this.changeFilterMode("sent")} className={filterMode == "sent" ? "active" : ""}>Sent</p>
                        <p onClick={() => this.changeFilterMode("received")} className={filterMode == "received" ? "active" : ""}>Received</p>
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
                                <UserEntry 
                                    key={user.getUsername()} 
                                    user={user} 
                                    withInvitation={withInvitation}
                                    refreshUsers={refreshUsers}
                                />
                            );
                        })}
                    </div>
                </Box> 
             </div>
        );
    }
}

export default withRouter(BoxWithUsers);