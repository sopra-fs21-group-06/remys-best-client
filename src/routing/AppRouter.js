import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Login from "../views/unauth/Login";
import Register from "../views/unauth/Register";
import WebsocketProvider from "../components/context/WebsocketProvider";
import Home from "../views/auth/Home";
import EditProfile from "../views/auth/EditProfile";
import WaitingRoom from "../views/auth/WaitingRoom";
import CreateNewGame from "../views/auth/CreateNewGame";
import ManageFriends from "../views/auth/ManageFriends";
import ChoosePlace from "../views/auth/ChoosePlace";
import Game from "../views/auth/Game";
import GameEnd from "../views/auth/GameEnd";
import AuthRoute from "./routes/AuthRoute";
import UnauthRoute from "./routes/UnauthRoute";

class AppRouter extends React.Component {

    isAuthenticated() {
        // TODO check if it is a valid token on the backend
        return localStorage.getItem("token") != null;
    }

    render() {      
        return (
            <BrowserRouter>
                <Route render={({ location }) => {
                    let isAuth = this.isAuthenticated()
                    return (
                        <WebsocketProvider isAuthOnMount={isAuth}>
                            <FadingRoutes location={location}>
                                <Switch location={location}>
                                    <UnauthRoute exact path='/login' component={Login} isAuth={isAuth}/>
                                    <UnauthRoute exact path='/register' component={Register} isAuth={isAuth}/>
                                    <AuthRoute exact path='/home' component={Home} isAuth={isAuth}/>
                                    <AuthRoute exact path='/waiting-room' component={WaitingRoom} isAuth={isAuth}/>
                                    <AuthRoute exact path='/create-new-game' component={CreateNewGame} isAuth={isAuth}/>
                                    <AuthRoute exact path='/manage-friends' component={ManageFriends} isAuth={isAuth}/>
                                    <AuthRoute exact path='/edit-profile' component={EditProfile} isAuth={isAuth}/>
                                    <AuthRoute exact path='/choose-place' component={ChoosePlace} isAuth={isAuth}/>
                                    <AuthRoute exact path='/game' component={Game} isAuth={isAuth}/>
                                    <AuthRoute exact path='/game-end' component={GameEnd} isAuth={isAuth}/>
                                    <Redirect to="/login" />
                                </Switch>
                            </FadingRoutes>
                        </WebsocketProvider>
                    )
                }}/>
            </BrowserRouter>
        );
    }
}

const FadingRoutes = (props) => {
    return (
        <TransitionGroup>
            <CSSTransition key={props.location.key} timeout={400} classNames="fade" exit={false} >
                {props.children}
            </CSSTransition>
        </TransitionGroup>
    )
}

export default AppRouter;