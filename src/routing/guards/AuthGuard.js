import React from "react";
import { Redirect } from "react-router-dom";

const AuthGuard = props => {
  return props.children;
  /*
  if (localStorage.getItem("token")) {
    return props.children;
  }
  return <Redirect to={"/login"} />;
  */
};

export default AuthGuard;
