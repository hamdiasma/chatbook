import React from "react";
import PropTypes from "prop-types";
import UserCard from "../card/UserCard";
import { useSelector } from "react-redux";
import Followbtn from "../btn/FollowBtn";
function Followers({ setShowFollowers, users }) {
  const { auth } = useSelector((state) => state);
  return (
    <>
      <div className="overlay" onClick={setShowFollowers} />
      <div className="follow">
        <div className="follow_box">
          <h5 className="text-center ">Followers</h5>
          <i className="far fa-times close" onClick={setShowFollowers}></i>
          <hr />
          {users.length > 0 ? (
            users.map((user) => (
              <UserCard key={user._id} user={user} onClick={setShowFollowers}>
                {auth.user._id !== user._id && <Followbtn user={user} />}
              </UserCard>
            ))
          ) : (
            <div className="no-follower">No followers.!</div>
          )}
        </div>
      </div>
    </>
  );
}

Followers.propTypes = {
  user: PropTypes.array,
  setShowFollowers: PropTypes.func,
};

export default Followers;
