import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import AuthGuard from "./guards/AuthGuard";
import UnauthGuard from "./guards/UnauthGuard";
import Login from "../views/unauth/Login";
import Register from "../views/unauth/Register";
import Home from "../views/auth/Home";
import EditProfile from "../views/auth/EditProfile";
import WaitingRoom from "../views/auth/WaitingRoom";
import ChoosePlace from "../views/auth/ChoosePlace";
import Game from "../views/auth/Game";
import GameEnd from "../views/auth/GameEnd";

class AppRouter extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <Route render={({ location }) => {
                    return (
                        <TransitionGroup>
                            <CSSTransition key={location.key} timeout={400} classNames="fade" appear>
                                <Switch>
                                    <Route exact path="/login">
                                        <UnauthGuard>
                                            <Login />
                                        </UnauthGuard>
                                    </Route>
                                    <Route exact path="/register">
                                        <UnauthGuard>
                                            <Register />
                                        </UnauthGuard>
                                    </Route>
                                    <Route exact path="/">
                                        <Redirect to={"/home"} />
                                    </Route>
                                    <Route exact path="/home">
                                        <AuthGuard>
                                            <Home />
                                        </AuthGuard>
                                    </Route>
                                    <Route exact path="/edit-profile">
                                        <AuthGuard>
                                            <EditProfile />
                                        </AuthGuard>
                                    </Route>
                                    <Route exact path="/waiting-room">
                                        <AuthGuard>
                                            <WaitingRoom />
                                        </AuthGuard>
                                    </Route>
                                    <Route exact path="/choose-place">
                                        <AuthGuard>
                                            <ChoosePlace />
                                        </AuthGuard>
                                    </Route>
                                    <Route exact path="/game">
                                        <AuthGuard>
                                            <Game />
                                        </AuthGuard>
                                    </Route>
                                    <Route exact path="/game-end">
                                        <AuthGuard>
                                            <GameEnd />
                                        </AuthGuard>
                                    </Route>
                                </Switch>
                            </CSSTransition>
                        </TransitionGroup>
                    )
                }}/>
            </BrowserRouter>
        );
    }
}

export default AppRouter;
