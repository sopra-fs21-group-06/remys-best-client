import React from 'react';
import { withRouter } from 'react-router-dom';
import { PopInOrSlideDown } from '../transitions/PopInOrSlideDown';
import { TransitionGroup } from 'react-transition-group';
import BlurredElement from '../BlurredElement';

class Notifications extends React.Component {

    render() {
        return (
            <TransitionGroup className="notification-list">
                {Object.keys(this.props.notifications).reverse().map(key => {
                    let {username, action, card} = this.props.notifications[key];
                    return (
                        <PopInOrSlideDown key={key}>
                            <BlurredElement className="notification-container" borderRadius={15} hasBorder={true}>
                                <div className="notification">
                                    {username && action && card ? 
                                        <p><span>{username}</span> {action} <span>{card}</span></p> 
                                        : 
                                        <p><span>{action}</span></p>
                                    }
                                </div>
                            </BlurredElement>
                        </PopInOrSlideDown>
                    );
                })}
            </TransitionGroup>
        );
    }
}

export default withRouter(Notifications);