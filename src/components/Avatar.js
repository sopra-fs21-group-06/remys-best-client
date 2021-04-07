import React from 'react';
import { withRouter } from 'react-router-dom';
import BlurredElement from './BlurredElement';
import avatar from '../img/avatar.png'

class Avatar extends React.Component {

    render() {
        let color = this.props.color ? this.props.color : 'empty'
         
        return (
            <BlurredElement borderRadius="25" hasBorder={true} size="60" className={"avatar-" + color}>
                <div className={"avatar-box " + color + "-bg"}>
                    <img src={avatar}/>
                </div>
            </BlurredElement>
        );
    }
}

export default withRouter(Avatar);