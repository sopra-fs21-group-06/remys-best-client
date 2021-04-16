import React from "react";

class LeftHand extends React.Component {

    render() {
        return (  
            <div className="left-hand">
                {this.props.children}
            </div>
        );
    }
}

export default LeftHand;