import React from 'react';
import { withRouter } from 'react-router-dom';
import { withWebsocketContext } from './WebsocketProvider';

/**
 * This component manages the subscription to websocket channels and represents a
 * wrapper for all view components which listen to websocket messages
 */
class WebsocketConsumer extends React.Component {

    constructor(props) {
        super(props);
        this.channels = this.props.channels ? this.props.channels : []
    }

    componentDidMount() {
        // CASE 1 – websocket connection is already established (when switching from AuthRoute to AuthRoute)
        if(this.props.websocketContext.isConnected) {
            this.uponConnectionEstablished()
        }
    }

    componentDidUpdate(prevProps) {
        // CASE 2 – wait until connection has been established (when switching from UnauthRoute to AuthRoute or on AuthRoute page reload)
        if (this.props.websocketContext.isConnected && prevProps.websocketContext !== this.props.websocketContext) {
            this.uponConnectionEstablished()
        }
    }

    uponConnectionEstablished() {
        this.props.websocketContext.handleSubscribe(this.channels)
        if(this.props.connectionCallback) {
            this.props.connectionCallback()
        }
    }

    componentWillUnmount() {
        this.props.websocketContext.handleUnsubscribe(this.channels)
    }

    render() {
        return this.props.children  
    }
}

export default withRouter(withWebsocketContext(WebsocketConsumer));