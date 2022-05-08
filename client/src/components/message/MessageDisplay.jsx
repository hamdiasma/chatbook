import React from "react";
import PropTypes from "prop-types";
import Avatar from "../avatar/Avatar";
import { imageShow, videoShow } from "../../utils/mediaShow";
import { useDispatch, useSelector } from "react-redux";
import { deleteMessageAction } from "../../redux/actions/message";
import Times from "../times/Times";

function MessageDisplay({
  user,
  msg,
  theme,
  data,
  handelCallPhone,
  handelCallVideo,
  audioDeleteRef,
}) {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const handelDelete = () => {
    if (data) {
      if (window.confirm("are you want to delete message")) {
        dispatch(deleteMessageAction({ data, msg, auth }));
        audioDeleteRef.current.play();
      }
    }
  };

  return (
    <>
      <div className="chat_title">
        <Avatar src={user.avatar} size="small-avatar" />
      </div>
      <div className="you_content">
        {user._id === auth.user._id && (
          <i
            className="fas fa-trash text-danger pointer"
            style={{
              filter: theme ? "invert(1)" : "invert(0)",
            }}
            onClick={handelDelete}
          ></i>
        )}

        <div>
          {msg.text && (
            <div
              className="chat_text"
              style={{ filter: theme ? "invert(1)" : "invert(0)" }}
            >
              {msg.text}
            </div>
          )}
          {msg.media &&
            msg.media.map((item, i) => (
              <div key={i} style={{ maxWidth: "320px" }}>
                {item.url.match(/video/i)
                  ? videoShow(item.url, theme)
                  : imageShow(item.url, theme)}
              </div>
            ))}
        </div>

        {msg.call && (
          <button
            onClick={msg.call.video ? handelCallVideo : handelCallPhone}
            className="btn btn btn-outline-secondary d-flex align-items-center py-0 px-3"
            style={{ background: "#eee", borderRadius: "10px" }}
          >
            <i
              className={
                msg.call.times === 0
                  ? msg.call.video
                    ? "fas fa-video-slash pointer"
                    : "fas fa-phone-slash pointer"
                  : msg.call.video
                  ? "fas fa-video pointer"
                  : "fas fa-phone-alt pointer"
              }
              style={{
                fontSize: "1.2rem",
                color: msg.call.times === 0 ? "#dc3545" : "#329c0cd1",
                filter: theme ? "invert(1)" : "invert(0)",
              }}
            />
            <div className="text-left mx-2">
              <span className="d-block" style={{ color: "#575655" }}>
                {msg.call.video ? "recall video " : "recall audio "}
              </span>
              <small style={{ color: "#575655" }}>
                {msg.call.times > 0 ? (
                  <Times total={msg.call.times} />
                ) : (
                  new Date(msg.call.times).toLocaleTimeString()
                )}
              </small>
            </div>
          </button>
        )}
      </div>

      {msg.createdAt && (
        <div className="chat_time">
          {new Date(msg.createdAt).toLocaleString()}
        </div>
      )}
    </>
  );
}

MessageDisplay.propTypes = {
  auth: PropTypes.object,
};

export default MessageDisplay;
