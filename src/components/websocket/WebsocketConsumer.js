import React from 'react';
import { withRouter } from 'react-router-dom';
import { withWebsocketContext } from './WebsocketProvider';

/**
 * This component manages the subscription to websocket channels and represents a
 * wrapper for all view components which listen to websocket messages
 */
class WebsocketConsumer extends React.Component {

    componentDidMount() {
<<<<<<< HEAD
        // in case of switching between pages (connection already established)
        if(this.props.contextValue.isConnected) {
            this.subscribeChannels()
=======
        // CASE 1 – websocket connection is already established (when switching from AuthRoute to AuthRoute)
        if(this.props.contextValue.isConnected) {
            this.uponConnectionEstablished()
>>>>>>> dev
        }
    }

    componentDidUpdate(prevProps) {
<<<<<<< HEAD
        // in case of the first page load with websockets (wait for connection)
        if (this.props.contextValue.isConnected && prevProps.contextValue !== this.props.contextValue) {
            this.subscribeChannels()
        }
    }

    subscribeChannels() {
        this.props.contextValue.handleSubscribe(this.props.channels)
=======
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
>>>>>>> dev
    }

    componentWillUnmount() {
        this.props.contextValue.handleUnsubscribe(this.props.channels)
    }

    render() {
        return this.props.children  
    }
}

export default withRouter(withWebsocketContext(WebsocketConsumer));