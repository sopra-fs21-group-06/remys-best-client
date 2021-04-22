import React from 'react';
import { Route } from 'react-router-dom';
import { Redirect } from "react-router-dom";

const UnauthRoute = ({ component: Component, isAuth, ...rest }) => {

    return (
        <Route {...rest} render={props => 
            !isAuth ? <Component {...props} /> : <Redirect to='/home' />
        } />
    )
}

export default UnauthRoute;