import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Avatar from "../avatar/Avatar";
import EditProfile from "./EditProfile";
import Followbtn from "../btn/FollowBtn";
import Followers from "./Followers";
import Followings from "./Followings";
import { modalAction } from "../../redux/actions/global";

function Info({ profile, id, auth, dispatch, theme }) {
  const [userData, setUserData] = useState([]);
  const [onEdit, setOnEdit] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowings, setShowFollowings] = useState(false);

  useEffect(() => {
    if (id === auth.user._id) {
      setUserData([auth.user]);
    } else {
      const newData = profile.users.filter((user) => user._id === id);
      setUserData(newData);
    }
  }, [id, auth, profile.users, dispatch]);

  useEffect(() => {
    if (showFollowers || showFollowings || onEdit) {
      dispatch(modalAction(true));
    } else {
      dispatch(modalAction(false));
    }
  }, [dispatch, showFollowers, showFollowings, onEdit]);

  return (
    <div className="info">
      {userData.map((user) => (
        <div className="info_container" key={user._id}>
          <Avatar src={user.avatar} size="xbig-avatar" />
          <div className="info_content">
            <div className="info_content_title">
              <h2>
                {user.username} {user.fullname}{" "}
              </h2>
              {user._id === auth.user._id ? (
                <button
                  style={{ filter: theme ? "invert(1)" : "invert(0)" }}
                  className="btn btn-outline-info"
                  onClick={() => setOnEdit(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <Followbtn user={user} />
              )}
            </div>
            <div
              className="follow_btn"
              style={{ filter: theme ? "invert(1)" : "invert(0)" }}
            >
              <span className="mr-3" onClick={() => setShowFollowers(true)}>
                {user.followers.length} Followrs
              </span>
              <span className="ml-3" onClick={() => setShowFollowings(true)}>
                {user.following.length} following
              </span>
            </div>

            {user.mobile && (
              <small className="">
                {" "}
                <i className="fas fa-phone"></i> {user.mobile}
              </small>
            )}

            <p className="m-0">{user.adress}</p>
            <h6 style={{ fontSize: "14px" }}>{user.email}</h6>
            <a href={user.website} target="_blank" rel="noreferrer">
              {user.website}
            </a>
            <p>{user.story}</p>
          </div>
          {user._id === auth.user._id && onEdit && (
            <EditProfile
              user={user}
              auth={auth}
              theme={theme}
              handelClose={() => setOnEdit(false)}
            />
          )}
          {showFollowers && (
            <Followers
              users={user.followers}
              setShowFollowers={() => setShowFollowers(false)}
            />
          )}
          {showFollowings && (
            <Followings
              users={user.following}
              setShowFollowings={() => setShowFollowings(false)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

Info.propTypes = {
  auth: PropTypes.object,
};

export default Info;
