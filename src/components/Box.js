import React from 'react';
import Blurred from './Blurred';

class Box extends React.Component {

    render() {
        let {className, borderRadius} = this.props
        return (
            <Blurred borderRadius={borderRadius ? borderRadius : "25"} hasBorder={true} className="box">
                <div className={"box-content " + (className ? className : '')}>
                    {this.props.children}
                </div>
            </Blurred>
        );
    }
}

export default Box;