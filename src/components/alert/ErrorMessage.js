import React from 'react';
import Box from '../Box'

class ErrorMessage extends React.Component {

    render() {
        return (
            <Box borderRadius="16" className="error-box">
                <div className="error-message">
                    {this.props.text}
                </div>
            </Box>
        );
    }
}

export default ErrorMessage