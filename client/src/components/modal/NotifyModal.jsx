import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import IconNotify from "../../images/notify.jpeg";
import { Link } from "react-router-dom";
import Avatar from "../avatar/Avatar";
import moment from "moment";
import {
  deletAllNotifies,
  isReadtNotifyAction,
  updateSoundAction,
} from "../../redux/actions/notify";
function NotifyModal({ notify, auth, theme }) {
  const dispatch = useDispatch();

  const handelSound = () => {
    dispatch(updateSoundAction(!notify.sound));
  };
  const handelIsReadNotify = (msg) => {
    dispatch(isReadtNotifyAction({ msg, auth }));
  };
  const handelDeleteAll = () => {
    const newArr = notify.data.filter((item) => item.isRead === false);
    if (newArr.length === 0) {
      return dispatch(deletAllNotifies(auth.token));
    }
    if (
      window.confirm(
        `you have ${newArr.length} new notifications.., want to delete all.!`
      )
    ) {
      return dispatch(deletAllNotifies(auth.token));
    }
  };

  return (
    <div className="px-3" style={{ minWidth: "200px" }}>
      <div className="d-flex justify-content-between align-items-center">
        <label>Notification</label>
        {notify.sound ? (
          <i
            className="fas fa-bell text-danger icon_sound"
            onClick={handelSound}
          ></i>
        ) : (
          <i
            className="fas fa-bell-slash text-danger icon_sound"
            onClick={handelSound}
          ></i>
        )}
      </div>
      <hr className="my-1" />
      {notify.data.length === 0 && (
        <img
          src={IconNotify}
          alt="Notify"
          className="w-100"
          style={{ filter: theme ? "invert(1)" : "invert(0)" }}
        />
      )}

      <div
        style={{
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {notify.data.map((msg, i) => (
          <div key={i} className="px-2 pb-2 mb-2 dropdown-item notify-items">
            <Link
              to={msg.url}
              className="d-flex text-dark align-items-center"
              onClick={() => handelIsReadNotify(msg)}
            >
              <Avatar src={msg.user.avatar} size="large-avatar" />
              <div className="mx-1 flex-fill">
                <div>
                  <strong className="mx-1">{msg.user.username}</strong>
                  <small className="mr-1">{msg.text}</small>
                </div>
                {msg.content && (
                  <small
                    style={{
                      filter: theme ? "invert(1)" : "invert(0)",
                      color: theme ? "white" : "",
                    }}
                  >
                    {msg.content.slice(0, 20)}...
                  </small>
                )}
              </div>
            </Link>
            <small
              style={{ fontSize: "10px" }}
              className="text-muted d-flex justify-content-between align-items-center w-100"
            >
              {" "}
              <i>{moment(msg.createdAt).fromNow()}</i>{" "}
              {!msg.isRead && <i className="fas fa-circle text-primary" />}
            </small>
          </div>
        ))}
      </div>
      {notify.data.length > 0 && (
        <div>
          {" "}
          <hr className="my-1" />
          <div
            className="text-right text-danger mr-2"
            style={{ textAlign: "right", fontSize: "12px" }}
          >
            <small style={{ cursor: "pointer" }} onClick={handelDeleteAll}>
              {" "}
              Delete All
            </small>
          </div>
        </div>
      )}
    </div>
  );
}

NotifyModal.propTypes = {};

export default NotifyModal;
