import React from 'react';
import { withRouter } from 'react-router-dom';
<<<<<<< HEAD
import Blurred from './Blurred';
=======
import BlurredElement from './BlurredElement';
>>>>>>> 1d7b81c (websocket basic implementation, first test until game screen (#111))

class Box extends React.Component {

    render() {
        return (
<<<<<<< HEAD
            <Blurred borderRadius="25" hasBorder={true} className="box">
                <div className={"box-content " + (this.props.className ? this.props.className : '')}>
                    {this.props.children}
                </div>
            </Blurred>
=======
            <BlurredElement borderRadius="25" hasBorder={true} className="box">
                <div className={"box-content " + (this.props.className ? this.props.className : '')}>
                    {this.props.children}
                </div>
            </BlurredElement>
>>>>>>> 1d7b81c (websocket basic implementation, first test until game screen (#111))
        );
    }
}

export default withRouter(Box);