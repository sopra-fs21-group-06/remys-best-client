import React from 'react';
import { withRouter } from 'react-router-dom';

class BlurredElement extends React.Component {

    render() {
        var borderRadiusStyle = {};
        if(this.props.borderRadius) {
            borderRadiusStyle.borderRadius = this.props.borderRadius + "px"
        }

        var borderStyle = {};
        if(this.props.hasBorder) {
            borderStyle.border = "1px solid #a6a6a6"
        }

        var sizeStyle = {};
        if(this.props.size) {
            sizeStyle.width = this.props.size + "px";
            sizeStyle.height = this.props.size + "px";
        } 

        return (
            <div className={"blurred-element "} style={borderRadiusStyle}>
                <div className={"container " + (this.props.className ? this.props.className : '')} style={sizeStyle}>
                    <div className="bg" style={borderRadiusStyle}></div>
                    <div className="content" style={{...borderRadiusStyle, ...borderStyle}}>{this.props.children}</div>
                </div>
            </div>
        );
    }
}

export default withRouter(BlurredElement);