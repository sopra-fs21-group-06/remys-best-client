import React from 'react';
import { withRouter } from 'react-router-dom';
import Blurred from './Blurred';

class Box extends React.Component {

    render() {
        return (
            <Blurred borderRadius="25" hasBorder={true} className="box">
                <div className={"box-content " + (this.props.className ? this.props.className : '')}>
                    {this.props.children}
                </div>
            </Blurred>
        );
    }
}

export default withRouter(Box);