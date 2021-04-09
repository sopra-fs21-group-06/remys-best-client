import React from 'react';
import { withRouter } from 'react-router-dom';
import BlurredElement from '../BlurredElement';

class Notification extends React.Component {
    
    render() {
        let {username, action, card} = this.props.notification;
       
        return (
            <div className="noti">
                <BlurredElement className="notification-container" borderRadius={15} hasBorder={true}>
                    <div className="notification">
                        {username && action && card ? 
                            <p>
                                <span>{username}</span> {action} <span>{card}</span>
                            </p> : 
                            <p>
                                <span>{action}</span>
                            </p>
                        }
                    </div>
                </BlurredElement>
            </div>
        );
    }
}

export default withRouter(Notification);