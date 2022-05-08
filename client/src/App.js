import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AlertComponent from "./components/alert/AlertComponent.jsx";
import PageRoute from "./customRouter/PageRoute";
import Login from "./pages/login";
import Home from "./pages/home";
import Register from "./pages/register";
import { refreshTokenAction } from "./redux/actions/auth";
import Header from "./components/hedaer/Header";
import PrivateRouter from "./customRouter/privateRouter";
import StatusModal from "./components/modal/StatusModal";
import { getPostsActions } from "./redux/actions/post";
import { getSuggestionsActions } from "./redux/actions/seggestions";
import io from "socket.io-client";
import { globalTypes } from "./redux/type/types";
import SocketClient from "./SocketClient";
import { getNotifiesAction } from "./redux/actions/notify.js";
import CallModel from "./components/modal/CallModel.jsx";
import Peer from "peerjs";
function App() {
  const dispatch = useDispatch();
  const { auth, status, modal, call } = useSelector((state) => state);

  useEffect(() => {
    dispatch(refreshTokenAction());
    const socket = io();
    dispatch({ type: globalTypes.SOCKET, payload: socket });
    return () => socket.close();
  }, [dispatch]);

  useEffect(() => {
    if (auth.token) {
      dispatch(getPostsActions(auth.token));
      dispatch(getSuggestionsActions(auth.token));
      dispatch(getNotifiesAction(auth.token));
    }
  }, [dispatch, auth.token]);

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("Ce navigateur ne prend pas en charge la notification de bureau");
    }

    // Vérifions si les autorisations de notification ont déjà été accordées
    else if (Notification.permission === "granted") {
    }

    // Sinon, nous devons demander la permission à l'utilisateur
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        // Si l'utilisateur accepte, créons une notification
        if (permission === "granted") {
        }
      });
    }
  }, []);

  // peer
  useEffect(() => {
    // const newPeer = new Peer(undefined, {
    //   host: "/",
    //   port: "3001",
    // });

    const newPeer = new Peer(undefined, {
      path: "/",
      secure: true,
    });
    dispatch({
      type: globalTypes.PEER,
      payload: newPeer,
    });
  }, [dispatch]);

  return (
    <Router>
      <AlertComponent />
      <input type="checkbox" id="theme" />
      <div className={`App ${(status || modal) && "mode"}`}>
        <div className="main">
          {auth.token && <Header />}
          {auth.token && status && <StatusModal />}
          {auth.token && <SocketClient />}
          {auth.token && call && <CallModel />}
          <Route exact path="/" component={auth.token ? Home : Login} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <PrivateRouter exact path="/:page" component={PageRoute} />
          <PrivateRouter exact path="/:page/:id" component={PageRoute} />
        </div>
      </div>
    </Router>
  );
}

export default App;
