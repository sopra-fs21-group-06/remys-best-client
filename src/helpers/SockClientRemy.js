import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { getDomain, isProduction } from "../helpers/domainUtils";

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
        body.token = localStorage.getItem('token');
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