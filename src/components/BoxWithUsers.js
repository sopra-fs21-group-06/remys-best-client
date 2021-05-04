import React from 'react';
import { withRouter } from 'react-router-dom';
import Box from './Box';
import avatar from '../img/avatar.png';
import Avatar from './Avatar';

class BoxWithUsers extends React.Component {

    render() {
        let {withFilter, users, isSubmitting} = this.props
        return (
            <div>
                {
                    withFilter && 
                    <div className="user-filter">
                        <p>All Users</p>
                        <p>Friends</p>
                        <p>Pending</p>
                        <p>Requests</p>
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
                        users.map(user => {
                            return (
                                <div className="user-entry" key={user.username}>
                                    <Avatar img={avatar} />
                                    <p className="username">{user.username}</p>
                                    <p className="email">{user.email}</p>
                                    <p className="status">{user.status}</p>
                                </div>  
                            );
                        })}
                    </div>
                </Box> 

                <p>Refresh</p>
             </div>
        );
    }
}

export default withRouter(BoxWithUsers);