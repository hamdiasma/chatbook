import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  alertTypes,
  authTypes,
  globalTypes,
  messageTypes,
  notifyTypes,
  postTypes,
} from "./redux/type/types";
import { APP_NAME } from "./utils/config";

import audioBlip2 from "./audio/motify-allappA.wav";
// import audioBlip1 from "./audio/cameraCap.wav";
//

const spawnNotification = (body, icon, url, title) => {
  let options = {
    body,
    icon,
  };

  let n = new Notification(title, options);
  n.onclick = (e) => {
    e.preventDefault();
    window.open(url, "_blank");
  };
};

function SocketClient() {
  const audioRef = useRef();
  const { auth, socket, notify, online, call } = useSelector((state) => state);
  const dispatch = useDispatch();

  //joinUser
  useEffect(() => {
    socket.emit("joinUser", auth.user);
  }, [socket, auth.user]);

  //likes && unLikes
  useEffect(() => {
    socket.on("likeToClient", (newPost) => {
      dispatch({
        type: postTypes.EDITE_POST,
        payload: newPost,
      });
    });
    return () => socket.off("likeToClient");
  }, [dispatch, socket]);

  useEffect(() => {
    socket.on("unLikeToClient", (newPost) => {
      dispatch({
        type: postTypes.EDITE_POST,
        payload: newPost,
      });
    });
    return () => socket.off("unLikeToClient");
  }, [dispatch, socket]);

  //comments
  useEffect(() => {
    socket.on("createCommentToClient", (newPost) => {
      dispatch({
        type: postTypes.EDITE_POST,
        payload: newPost,
      });
    });
    return () => socket.off("createCommentToClient");
  }, [dispatch, socket]);

  useEffect(() => {
    socket.on("deleteCommentToClient", (newPost) => {
      dispatch({
        type: postTypes.EDITE_POST,
        payload: newPost,
      });
    });
    return () => socket.off("deleteCommentToClient");
  }, [dispatch, socket]);

  // follow
  useEffect(() => {
    socket.on("followToClient", (newUser) => {
      dispatch({
        type: authTypes.REFRESH_INFO,
        payload: {
          ...auth,
          user: newUser,
        },
      });
    });
    return () => socket.off("followToClient");
  }, [dispatch, socket, auth]);

  useEffect(() => {
    socket.on("unFollowToClient", (newUser) => {
      dispatch({
        type: authTypes.REFRESH_INFO,
        payload: {
          ...auth,
          user: newUser,
        },
      });
    });
    return () => socket.off("unFollowToClient");
  }, [dispatch, socket, auth]);
  // notify
  useEffect(() => {
    socket.on("creaNotifyToClient", (msg) => {
      if (notify.sound) {
        audioRef.current.play();
      }
      dispatch({
        type: notifyTypes.CREATE_NOTIFY,
        payload: msg,
      });
      spawnNotification(
        msg.user.username + " " + msg.text,
        msg.user.avatar,
        msg.url,
        APP_NAME
      );
    });
    return () => socket.off("creaNotifyToClient");
  }, [dispatch, socket, auth, notify.sound]);

  useEffect(() => {
    socket.on("removeNotifyToClient", (msg) => {
      dispatch({
        type: notifyTypes.REMOVE_NOTIFY,
        payload: msg,
      });
    });
    return () => socket.off("removeNotifyToClient");
  }, [dispatch, socket, auth]);

  // message

  useEffect(() => {
    socket.on("addMessageToClient", (msg) => {
      dispatch({
        type: messageTypes.ADD_MESSAGE,
        payload: msg,
      });
      dispatch({
        type: messageTypes.ADD_USER,
        payload: { ...msg.user, text: msg.text, media: msg.media },
      });
    });
    return () => socket.off("addMessageToClient");
  }, [dispatch, socket, auth]);

  //check user online

  useEffect(() => {
    socket.emit("chekUserOnline", auth.user);
  }, [socket, auth.user]);

  useEffect(() => {
    socket.on("chekUserOnlineToMe", (data) => {
      data.forEach((item) => {
        if (!online.includes(item.id)) {
          dispatch({
            type: globalTypes.ONLINE,
            payload: item.id,
          });
        }
      });
    });
    return () => socket.off("chekUserOnlineToMe");
  }, [dispatch, socket, online]);
  useEffect(() => {
    socket.on("checkUserOnlineToClient", (id) => {
      if (!online.includes(id)) {
        dispatch({
          type: globalTypes.ONLINE,
          payload: id,
        });
      }
    });
    return () => socket.off("checkUserOnlineToClient");
  }, [dispatch, socket, online]);
  // check user offLine
  useEffect(() => {
    socket.on("checkuserOffLineToClient", (id) => {
      dispatch({
        type: globalTypes.OFFLINE,
        payload: id,
      });
    });
    return () => socket.off("checkuserOffLineToClient");
  }, [dispatch, socket, online]);

  // call user
  useEffect(() => {
    socket.on("callUserToClient", (data) => {
      dispatch({
        type: globalTypes.CALL,
        payload: data,
      });
    });
    return () => socket.off("callUserToClient");
  }, [dispatch, socket]);

  useEffect(() => {
    socket.on("userBusy", (data) => {
      dispatch({
        type: alertTypes.ALERT_MESSAGE,
        payload: { error: `${call.username} is alredy in other call.!` },
      });

      // dispatch({
      //   type: globalTypes.CALL,
      //   payload: null,
      // });
    });

    return () => socket.off("userBusy");
  }, [dispatch, socket, call]);

  return (
    <>
      <audio controls ref={audioRef} style={{ display: "none" }}>
        <source src={audioBlip2} type="audio/wav" />
      </audio>
    </>
  );
}

SocketClient.propTypes = {
  auth: PropTypes.object,
};

export default SocketClient;
