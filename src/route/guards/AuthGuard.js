import React from "react";
import { Redirect } from "react-router-dom";

const AuthGuard = props => {
  if (localStorage.getItem("token")) {
    return props.children;
  }
  return <Redirect to={"/login"} />;
};

export default AuthGuard;
