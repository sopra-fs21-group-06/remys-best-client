import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import AuthGuard from "./guards/AuthGuard";
import UnauthGuard from "./guards/UnauthGuard";
import Login from "../views/unauth/Login";
import Home from "../views/auth/Home";

class AppRouter extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
            <Route exact path="/">
                <Redirect to={"/home"} />
            </Route>
            <Route exact path="/home">
                <AuthGuard>
                    <Home />
                </AuthGuard>
            </Route>
            <Route exact path="/login">
                <UnauthGuard>
                    <Login />
                </UnauthGuard>
            </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default AppRouter;
