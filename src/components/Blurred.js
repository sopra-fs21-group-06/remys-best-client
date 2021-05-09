import React from 'react';

class Blurred extends React.Component {

    render() {
        let {counter, borderRadius, size, hasBorder, className} = this.props

        var borderRadiusStyle = {};
        if(borderRadius) {
            borderRadiusStyle.borderRadius = borderRadius + "px"
        }

        var borderStyle = {};
        if(hasBorder) {
            borderStyle.border = "1px solid #a6a6a6"
        }

        var sizeStyle = {};
        if(size) {
            sizeStyle.width = size + "px";
            sizeStyle.height = size + "px";
        } 

        return (
            <div className={"blurred-element " + (counter ? "counter-container" : "")} style={borderRadiusStyle}>
                {counter && <div className="counter">{counter}</div>}
                <div className={"container " + (className ? className : '')} style={sizeStyle}>
                    <div className="bg" style={borderRadiusStyle}></div>
                    <div className="content" style={{...borderRadiusStyle, ...borderStyle}}>{this.props.children}</div>
                </div>
            </div>
        );
    }
}

export default Blurred;