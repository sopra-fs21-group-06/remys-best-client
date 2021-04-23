import React from 'react';
import { Route } from 'react-router-dom';
import { Redirect } from "react-router-dom";

const AuthRoute = ({ component: Component, isAuth, ...rest }) => {

    return (
        <Route {...rest} render={props => 
            isAuth ? <Component {...props} /> : <Redirect to='/login' />
        } />
    )
}

export default AuthRoute;