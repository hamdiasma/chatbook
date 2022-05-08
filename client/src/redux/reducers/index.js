import { combineReducers } from "redux";
import auth from "./auth";
import alert from "./alert";
import theme from "./theme";
import profile from "./profile";
import status from "./status";
import homePosts from "./post";
import modal from "./modal";
import detailPost from "./detailPost";
import discover from "./discover";
import seggestions from "./seggestions";
import socket from "./socketRouter";
import notify from "./notifiesReducers";
import message from "./message";
import online from "./onlineReducer";
import call from "./callReducer";
import peer from "./peerReducer";

export default combineReducers({
  auth,
  alert,
  profile,
  theme,
  status,
  homePosts,
  modal,
  detailPost,
  discover,
  seggestions,
  socket,
  notify,
  message,
  online,
  call,
  peer,
});
