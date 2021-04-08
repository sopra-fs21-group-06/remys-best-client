import React from 'react';
import { withRouter } from 'react-router-dom';
import Box from './Box';

class NavigationBox extends React.Component {

    render() {
        return (
            <div onClick={this.props.onClick} className="navigation-box">
                <Box>
                    <p className="box-title">{this.props.title}</p>
                    <p className="box-subtitle">{this.props.subtitle}</p>
                </Box>
            </div>
        );
    }
}

export default withRouter(NavigationBox);