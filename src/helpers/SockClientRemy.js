import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { getDomain, isProduction } from "../helpers/domainUtils";
import sessionManager from "../helpers/sessionManager";

export const createSockClient = () => {
    var state = {
        isConnected: false,
        sock: null, 
        stomp: null
    };

    const subscribe = (channel, callback) => {
        return state.stomp.subscribe(channel, r => callback(stripResponse(r)));
    }

    const send = (destination, body) => {
        state.stomp.send(destination, {}, JSON.stringify(body ? body : {}));
    }

    const stripResponse = (response) => {
        return JSON.parse(response.body);
    }

    const handleError = (error) => {
        console.error(error);
        //this._handleDisconnect("Socket error.");
    }

    const handleDisconnect = (reason) => {
        console.log(reason)
        state.isConnected = false;
        /*
        for (let callback of this._disconnectCallbacks) {
            callback(reason);
        }*/
    }

    // return all public methods
    return ({
        isConnected: () => state.isConnected,
        connect: (callback) =>  {
            try {
                state.sock.close(); // TODO needed? 
            } catch {
            }

            state.sock = new SockJS(`${getDomain()}/ws`);
            state.stomp = Stomp.over(state.sock);

            // log stomp messages only in dev mode
            state.stomp.debug = (message) => {!isProduction() && console.log(message)};

            state.stomp.connect({}, () => {
                state.isConnected = true;
                //subscribe('/topic/register', function(){console.log("Answered")});
                subscribe("/user/queue/register", function(){console.log("Answered specific")});
                if (callback) {
                    callback();
                }
            });

            state.sock.onclose = r => {
                console.log("Socket closed!", r);
                handleDisconnect("Socket closed.");
            };
            state.sock.onerror = e => handleError(e);
        },
        disconnect: (reason) => {
            try {
                state.stomp.disconnect(() => handleDisconnect(reason), {});
            } catch {
            }
        },
        subscribe: (channel, callback) => {
            return subscribe(channel, callback);
        },
        send: (destination, body) => {
            send(destination, body);
        }
    });
};




class SockClient {
    constructor() {
        this._connected = false;
        this._registered = false;
        this._disconnectCallbacks = [];
        this._registerCallbacks = [];
        this._messageCallbacks = {};
        this.sessionId = "";
    }

    isConnected() {
        return this._connected;
    }

    isRegistered() {
        return this._registered;
    }

    connect(callback) {
        try {
            this.sock.close();
        } catch {
        }
        this.sock = new SockJS(`${getDomain()}/ws`);
        this.stomp = Stomp.over(this.sock);
        this.stomp.debug = this._debug;
        this.stomp.connect({}, () => {
            this._connected = true;
            //let url = this.stomp.ws._transport.url;
            /*let domainUrl = getDomain().toString();
            let regex1 = /https*!/;
            domainUrl = domainUrl.replace(regex1, "");
            url = url.replace(/ws:)*/
            this.subscribe('/topic/register', function(){console.log("Answered")});
            this.subscribe("/user/queue/register", function(){console.log("Answered specific")});
            if (callback) {
                callback();
            }
        });
        this.sock.onclose = r => {
            console.log("Socket closed!", r);
            this._handleDisconnect("Socket closed.");
        };
        this.sock.onerror = e => this._handleError(e);
    }

    disconnect(reason) {
        try {
            this.stomp.disconnect(() => this._handleDisconnect(reason), {});
        } catch {
        }
    }

    connectAndRegister(token) {
         this.connect(() => {console.log("hi")});
        /*
        this.connect(() => {
            this.register(token);
        });*/
    }

    register() {
        this.send('/app/register', {token: "Hello"});
    }

    reconnect(token) {
        // remove disconnect callbacks so we don't
        // trigger anything while reconnecting

        let callbacks = this._disconnectCallbacks.slice();
        this._disconnectCallbacks = [];

        this.disconnect("Reconnecting");

        setTimeout(() => {
            this._disconnectCallbacks = callbacks;
            this.connectAndRegister(token);
        }, 500);
    }

    subscribe(channel, callback) {
        this.stomp.subscribe(channel, r => callback(this._stripResponse(r)));
    }

    send(destination, body) {
        this.stomp.send(destination, {}, JSON.stringify(body ? body : {}));
    }

    sendToLobby(channel, body) {
        this.send(`/app/lobby/${sessionManager.lobbyId}${channel}`, body);
    }

    onRegister(callback) {
        this._registerCallbacks.push(callback);
    }

    clearMessageSubscriptions() {
        this._messageCallbacks = {};
    }

    onDisconnect(callback) {
        this._disconnectCallbacks.push(callback);
    }

    clearDisconnectSubscriptions() {
        this._disconnectCallbacks = [];
    }

    onLobbyMessage(channel, callback) {
        if (!this._messageCallbacks.hasOwnProperty(channel)) {
            this._messageCallbacks[channel] = [];
        }
        this._messageCallbacks[channel].push(callback);
    }

    _handleError(error) {
        console.error(error);
        this._handleDisconnect("Socket error.");
    }

    _handleDisconnect(reason) {
        this._connected = false;
        for (let callback of this._disconnectCallbacks) {
            callback(reason);
        }
    }

    _handleRegister(response) {
        this._registered = true;
        sessionManager.lobbyId = response.lobbyId;

        this.stomp.subscribe(`/user/queue/lobby/${response.lobbyId}/*`, r => this._handleMessage(r));
        this.stomp.subscribe(`/user/queue/lobby/${response.lobbyId}/*/*`, r => this._handleMessage(r));

        for (let callback of this._registerCallbacks) {
            callback(response);
        }
    }

    _handleMessage(response) {
        let msg = JSON.parse(response.body);
        let channel = response.headers.destination;
        let lobbyChannel = channel.replace(/.+\/lobby\/.+\//i, '/');

        if (!this._messageCallbacks.hasOwnProperty(lobbyChannel)) {
            return
        }

        for (let callback of this._messageCallbacks[lobbyChannel]) {
            callback(msg);
        }
    }

   

   
}

export default new SockClient();