import React from "react";
import { CSSTransition } from 'react-transition-group';

export class PickUpAndDrop extends React.Component{
    constructor() {
        super()
    }
    
    render() {
        const extendedProps = { 
            ...this.props,
            timeout: 500,
            classNames: "pickUpAndDrop",
            unmountOnExit: true
        }
        return (
            <CSSTransition {...extendedProps}>
                {this.props.children}
            </CSSTransition>
        )
    }
}