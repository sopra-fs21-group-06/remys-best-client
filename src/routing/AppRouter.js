import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import AuthGuard from "./guards/AuthGuard";
import UnauthGuard from "./guards/UnauthGuard";
import Login from "../views/unauth/Login";
import Register from "../views/unauth/Register";
import Home from "../views/auth/Home";
import WaitingRoom from "../views/auth/WaitingRoom";
import ChoosePlace from "../views/auth/ChoosePlace";
import Game from "../views/auth/Game";

class AppRouter extends React.Component {
  render() {
    return (
      <BrowserRouter>
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
        </Switch>
      </BrowserRouter>
    );
  }
}

export default AppRouter;
