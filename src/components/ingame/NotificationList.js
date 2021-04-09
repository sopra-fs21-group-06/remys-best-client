import React from 'react';
import { withRouter } from 'react-router-dom';
import { PopInOrSlideDown } from '../transitions/PopInOrSlideDown';
import Notification from './Notification';
import { TransitionGroup } from 'react-transition-group';

const NOTIFICATIONS = [{
            action: 'Card exchange'
        }, {
            username: 'You',
            action: 'sent',
            card: 'Heart King'
        }, {
            username: 'You',
            action: 'received',
            card: 'Joker'
        }, {
            username: 'Siddhant',
            action: 'played',
            card: 'Clubs Queen'
        }, {
            username: 'Andrina',
            action: 'played',
            card: 'Diamonds Ace'
        }]

class NotificationList extends React.Component {

    constructor() {
        super();
        this.state = {
            notifications: [],
            counter: 0
        }
    }

    componentDidMount() {
        this.addNotification();
    }

    addNotification() {
        let notification = NOTIFICATIONS[this.state.counter];
        this.setState({
            notifications: {
                ...this.state.notifications,
                [+new Date()]: notification
            },
            counter: this.state.counter+1
        });
    }

    render() {
        const notificationList = Object.keys(this.state.notifications).reverse().map(key => {
            return (
                <PopInOrSlideDown key={key}>
                    <Notification notification={this.state.notifications[key]} />
                </PopInOrSlideDown>
            );
        });

        return (
            <div>
                <p onClick={() => this.addNotification()}>add notification</p>
                <TransitionGroup className="notification-list">
                    {notificationList}
                </TransitionGroup>
            </div>
        );
    }
}

export default withRouter(NotificationList);