import React from 'react';
import Box from '../Box';
import sessionManager from "../../helpers/sessionManager"

class Invitation extends React.Component {

    reject() {
        this.props.websocketContext.sockClient.send(`/app/game-session-request/${this.props.gameSessionId}/reject`, { token: localStorage.getItem("token"),  gameSessionId: this.props.gameSessionId});
        this.props.closeAlert()
    }

    accept() {
        this.props.websocketContext.sockClient.send(`/app/game-session-request/${this.props.gameSessionId}/accept`, { token: localStorage.getItem("token"),  gameSessionId: this.props.gameSessionId});
        this.props.closeAlert()
        sessionManager.setGameSessionId(this.props.gameSessionId)
        this.props.history.push('/create-new-game')
    }

    render() {
        let {countdown, hostName} = this.props

        return (
            <Box borderRadius="16" counter={countdown}>
                <div className="invitation">
                    <div className="text"><p>Invitation from <span className="host-name">{hostName}</span></p></div>
                    <div className="btn-wrapper">
                        <p onClick={() => this.reject()} className="reject clickable">Reject</p>
                        <p onClick={() => this.accept()} className="accept clickable">Accept</p>
                    </div>
                </div>
            </Box>
        );
    }
}

export default Invitation