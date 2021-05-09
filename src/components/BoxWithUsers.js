import React from 'react';
import { withRouter } from 'react-router-dom';
import Box from './Box';
import UserEntry from './UserEntry';
import { userCategories } from "../helpers/constants";

class BoxWithUsers extends React.Component {

    constructor() {
        super();
        this.state = {
            filteredCategory: userCategories.FRIENDS
        };
    }

    changeCategory(newCategory) {
        this.setState({filteredCategory: newCategory})
    }

    render() {
        let {withFilter, users, isSubmitting, title, withInvitation, refreshUsers} = this.props
        let {filteredCategory} = this.state
        let {FRIENDS, SENT, RECEIVED} = userCategories

        let usersToShow = users.filter(user => {
            return user.getCategory() === filteredCategory
        });

        return (
            <div>
                {
                    withFilter && 
                    <div className="user-filter">
                        <p onClick={() => this.changeCategory(FRIENDS)} className={filteredCategory == FRIENDS ? "active" : ""}>{FRIENDS}</p>
                        <p onClick={() => this.changeCategory(SENT)} className={filteredCategory == SENT ? "active" : ""}>{SENT}</p>
                        <p onClick={() => this.changeCategory(RECEIVED)} className={filteredCategory == RECEIVED ? "active" : ""}>{RECEIVED}</p>
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