import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Login from "../views/unauth/Login";
import Register from "../views/unauth/Register";
import WebsocketConnection from "../views/WebsocketConnection";
import Home from "../views/auth/Home";
import EditProfile from "../views/auth/EditProfile";
import WaitingRoom from "../views/auth/WaitingRoom";
import ChoosePlace from "../views/auth/ChoosePlace";
import Game from "../views/auth/Game";
import GameEnd from "../views/auth/GameEnd";

class AppRouter extends React.Component {

    isAuthenticated() {
        // TODO check if it is a valid token
        return localStorage.getItem("token") != null;
    }

    render() {      
        return (
            <BrowserRouter>
                <Switch> 
                    { this.isAuthenticated() &&
                        <Route render={({ location }) => {
                            return (
                                <WebsocketConnection>
                                    <FadingRoutes location={location}>
                                        <Route exact path='/home' component={Home} />
                                        <Route exact path='/edit-profile' component={EditProfile} />
                                        <Route exact path='/waiting-room' component={WaitingRoom} />
                                        <Route exact path='/choose-place' component={ChoosePlace} />
                                        <Route exact path='/game' component={Game} />
                                        <Route exact path='/game-end' component={GameEnd} />
                                        <Redirect to="/home"/>
                                    </FadingRoutes>
                                </WebsocketConnection>
                            )
                        }}/>
                    }
                    <Route render={({ location }) => {
                        return (
                            <FadingRoutes location={location}>
                                <Route exact path='/login' component={Login} />
                                <Route exact path='/register' component={Register} />
                                <Redirect to="/login"/> 
                            </FadingRoutes>
                        )
                    }}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

const FadingRoutes = (props) => {
    return (
        <TransitionGroup>
            <CSSTransition key={props.location.key} timeout={400} classNames="fade" appear>
                <Switch>
                    {props.children}
                </Switch>
            </CSSTransition>
        </TransitionGroup>
    )
}

export default AppRouter;