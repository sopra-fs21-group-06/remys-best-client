import React from 'react';
import { withRouter } from 'react-router-dom';
import Blurred from './Blurred';

/*
class Invitation extends React.Component {

    render() {
        
        let colorName = this.props.colorName ? this.props.colorName : 'no-color'
        let img = this.props.img ? this.props.img : 'no-img'

        return (
            <Blurred borderRadius="25" hasBorder={true} size={this.props.size ? this.props.size : "60"} className={"avatar avatar-" + colorName}>
                <div className={"avatar-box " + colorName + "-bg " + (this.props.img ? '' : 'no-img')} onClick={this.props.onClick}>
                    {this.props.img ? <img src={this.props.img}/> : null}
                </div>
            </Blurred>
        );
    }
}

export default withRouter(Invitation)*/