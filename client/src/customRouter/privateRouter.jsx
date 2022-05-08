import React from "react";
import { Route, Redirect } from "react-router-dom";
function privateRouter(props) {
  const socialLogged = localStorage.getItem("socialLogged");
  return socialLogged ? <Route {...props} /> : <Redirect to="/" />;
}

export default privateRouter;
