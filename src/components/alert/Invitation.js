import React from 'react';
import Box from '../Box';
import sessionManager from "../../helpers/sessionManager"

class Invitation extends React.Component {

    reject() {
        // TODO send to backend: stop counter on backend and remove from invited users list
        this.props.closeAlert()
    }

    accept() {
        // TODO? send acception (send acception to server?)
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