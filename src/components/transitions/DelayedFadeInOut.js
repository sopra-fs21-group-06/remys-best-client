import React from "react";
import { CSSTransition } from 'react-transition-group';

export class DelayedFadeInOut extends React.Component{


    // TODO css stuff in here and work with variables (multiple delays at the same time)
    
    render() {
        const extendedProps = { 
            ...this.props,
            timeout: {
                enter: 300,
                exit: 0,
            },
            classNames: "delayedFadeInOut",
            unmountOnExit: true,
            mountOnEnter: true
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