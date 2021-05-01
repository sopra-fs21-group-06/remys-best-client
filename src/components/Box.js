import React from 'react';
import { withRouter } from 'react-router-dom';
<<<<<<< HEAD
import BlurredElement from './BlurredElement';
=======
import Blurred from './Blurred';
>>>>>>> dev

class Box extends React.Component {

    render() {
        return (
<<<<<<< HEAD
            <BlurredElement borderRadius="25" hasBorder={true} className="box">
                <div className={"box-content " + (this.props.className ? this.props.className : '')}>
                    {this.props.children}
                </div>
            </BlurredElement>
=======
            <Blurred borderRadius="25" hasBorder={true} className="box">
                <div className={"box-content " + (this.props.className ? this.props.className : '')}>
                    {this.props.children}
                </div>
            </Blurred>
>>>>>>> dev
        );
    }
}

export default withRouter(Box);