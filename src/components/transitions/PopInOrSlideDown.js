import React from "react";
import { CSSTransition } from 'react-transition-group';

export class PopInOrSlideDown extends React.Component{
    constructor() {
        super()
    }
    
    render() {
        const extendedProps = { 
            ...this.props,
            timeout: 500,
            classNames: "popInOrSlideDown",
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