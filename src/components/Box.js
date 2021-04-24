import React from 'react';
import { withRouter } from 'react-router-dom';
import BlurredElement from './BlurredElement';

class Box extends React.Component {

    render() {
        return (
            <BlurredElement borderRadius="25" hasBorder={true} className="box">
                <div className={"box-content " + (this.props.className ? this.props.className : '')}>
                    {this.props.children}
                </div>
            </BlurredElement>
        );
    }
}

export default withRouter(Box);