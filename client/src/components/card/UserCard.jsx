import React from "react";
import PropTypes from "prop-types";
import Avatar from "../avatar/Avatar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function UserCard({ children, user, border, msg, ...otherProps }) {
  const { theme } = useSelector((state) => state);

  const showMsg = (user) => {
    return (
      <>
        {" "}
        <div
          style={{
            filter: theme ? "invert(1)" : "invert(0)",
            color: theme ? "#fff" : "",
          }}
        >
          {user.text}
        </div>
        {user.media && user.media.length > 0 && (
          <div>
            {user.media.length} <i className="fas fa-image"></i>
          </div>
        )}
        {user.call && (
          <i
            className={
              user.call.times === 0
                ? user.call.video
                  ? "fas fa-video-slash pointer"
                  : "fas fa-phone-slash pointer"
                : user.call.video
                ? "fas fa-video pointer"
                : "fas fa-phone pointer"
            }
            style={{
              fontSize: "1.1rem",
              color: user.call.times === 0 ? "#dc3545" : "#329c0cd1",
              filter: theme ? "invert(1)" : "invert(0)",
            }}
          />
        )}
      </>
    );
  };

  let typeUserCard = (
    <div className="d-flex  align-items-center">
      <Avatar src={user.avatar} size="large-avatar" />
      <div className="mx-2" style={{ transform: "translateY('-2px')" }}>
        <span className="d-block">{user.username}</span>

        <small
          style={{
            opacity: 0.7,
            cursor: "pointer",
          }}
        >
          {msg ? showMsg(user) : user.fullname}
        </small>
      </div>
    </div>
  );

  return (
    <div
      className={`userItem d-flex justify-content-between p-2 align-items-center w-100 ${
        border && border
      }`}
    >
      {otherProps.isNotLink ? (
        typeUserCard
      ) : (
        <Link to={`/profile/${user._id}`} {...otherProps}>
          {typeUserCard}
        </Link>
      )}
      {children}
    </div>
  );
}

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserCard;
