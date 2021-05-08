import React from 'react';
import Box from '../Box';

class Alert extends React.Component {

    render() {
        return (
            <div className="alert">
                <Box>
                     {this.props.component}
                </Box>
            </div>
        );
    }
}

export default Alert;