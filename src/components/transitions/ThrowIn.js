import React from "react";
import { CSSTransition } from 'react-transition-group';

export class ThrowIn extends React.Component{
    constructor() {
        super()
    }
    
    render() {
        const extendedProps = { 
            ...this.props,
            timeout: 1000, // has to be the same amount as in fadeInOut.scss
            classNames: "throwIn" ,
            unmountOnExit: true
        }
        return (
            <CSSTransition {...extendedProps}>
                <div>
                    {this.props.children}
                </div>
            </CSSTransition>
        )
    }
}