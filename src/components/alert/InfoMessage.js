import React from 'react';
import Box from '../Box'

class InfoMessage extends React.Component {

    render() {
        return (
            <Box borderRadius="16">
                <div className="info-message">
                    {this.props.text}
                </div>
            </Box>
        );
    }
}

export default InfoMessage