import React from "react";

class HandContainer extends React.Component {

    render() {
        let {position} = this.props 
        return (  
            <div className={"hand-container " + (position ? position + '-hand-container' : '')}>
                <div className={position ? position + '-hand' : ''}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default HandContainer;