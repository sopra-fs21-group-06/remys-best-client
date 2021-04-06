import React from "react";
import { Redirect } from "react-router-dom";

const UnauthGuard = props => {
  if (!localStorage.getItem("token")) {
    return props.children;
  }
  // if user is already logged in, redirects to the main /app
  return <Redirect to={"/game"} />;
};

export default UnauthGuard;
