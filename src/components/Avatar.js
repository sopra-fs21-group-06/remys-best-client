import React from 'react';
import { withRouter } from 'react-router-dom';
<<<<<<< HEAD
import Blurred from './Blurred';
=======
import BlurredElement from './BlurredElement';
>>>>>>> 1d7b81c (websocket basic implementation, first test until game screen (#111))

class Avatar extends React.Component {

    render() {
        let colorName = this.props.colorName ? this.props.colorName : 'no-color'
        let img = this.props.img ? this.props.img : 'no-img'

        return (
<<<<<<< HEAD
            <Blurred borderRadius="25" hasBorder={true} size={this.props.size ? this.props.size : "60"} className={"avatar avatar-" + colorName}>
                <div className={"avatar-box " + colorName + "-bg " + (this.props.img ? '' : 'no-img')} onClick={this.props.onClick}>
                    {this.props.img ? <img src={this.props.img}/> : null}
                </div>
            </Blurred>
=======
            <BlurredElement borderRadius="25" hasBorder={true} size={this.props.size ? this.props.size : "60"} className={"avatar avatar-" + colorName}>
                <div className={"avatar-box " + colorName + "-bg " + (this.props.img ? '' : 'no-img')} onClick={this.props.onClick}>
                    {this.props.img ? <img src={this.props.img}/> : null}
                </div>
            </BlurredElement>
>>>>>>> 1d7b81c (websocket basic implementation, first test until game screen (#111))
        );
    }
}

export default withRouter(Avatar);