import React from 'react';
import { withRouter } from 'react-router-dom';
import { withWebsocketContext } from './WebsocketProvider';

/**
 * This component manages the subscription to websocket channels and represents a
 * wrapper for all view components which listen to websocket messages
 */
class WebsocketConsumer extends React.Component {

    componentDidMount() {
        // CASE 1 – websocket connection is already established (when switching from AuthRoute to AuthRoute)
        if(this.props.contextValue.isConnected) {
            this.uponConnectionEstablished()
        }
    }

    componentDidUpdate(prevProps) {
        // CASE 2 – wait until connection has been established (when switching from UnauthRoute to AuthRoute or on AuthRoute page reload)
        if (this.props.contextValue.isConnected && prevProps.contextValue !== this.props.contextValue) {
            this.uponConnectionEstablished()
        }
    }

    uponConnectionEstablished() {
        this.props.contextValue.handleSubscribe(this.props.channels)
        if(this.props.connectionCallback) {
            this.props.connectionCallback()
        }
    }

    componentWillUnmount() {
        this.props.contextValue.handleUnsubscribe(this.props.channels)
    }

    render() {
        return this.props.children  
    }
}

export default withRouter(withWebsocketContext(WebsocketConsumer));