import React from 'react';
import { withRouter } from 'react-router-dom';
import BlurredElement from './BlurredElement';

class Avatar extends React.Component {

    render() {
        let color = this.props.color ? this.props.color : 'no-color'
        let img = this.props.img ? this.props.img : 'no-img'

        return (
            <BlurredElement borderRadius="25" hasBorder={true} size={this.props.size ? this.props.size : "60"} className={"avatar avatar-" + color}>
                <div className={"avatar-box " + color + "-bg " + (this.props.img ? '' : 'no-img')} onClick={this.props.onClick}>
                    {this.props.img ? <img src={this.props.img}/> : null}
                </div>
            </BlurredElement>
        );
    }
}

export default withRouter(Avatar);