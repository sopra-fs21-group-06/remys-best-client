import React from 'react';
import { withRouter } from 'react-router-dom';
import { withWebsocketContext } from './WebsocketProvider';

/**
 * This component manages the subscription to websocket channels and represents a
 * wrapper for all view components which listen to websocket messages
 */
class WebsocketConsumer extends React.Component {

    componentDidMount() {
        // in case of switching between pages within the websocket provider (connection already established)
        if(this.props.contextValue.isConnected) {
            this.subscribeChannels()
        }
    }

    componentDidUpdate(prevProps) {
        // in case of the first page load with websockets (wait for connection)
        if (this.props.contextValue.isConnected && prevProps.contextValue !== this.props.contextValue) {
            this.subscribeChannels()
        }
    }

    subscribeChannels() {
        this.props.contextValue.handleSubscribe(this.props.channels)
    }

    componentWillUnmount() {
        this.props.contextValue.handleUnsubscribe(this.props.channels)
    }

    render() {
        return this.props.children  
    }
}

export default withRouter(withWebsocketContext(WebsocketConsumer));