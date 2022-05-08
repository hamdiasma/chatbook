import React from "react";
import PropTypes from "prop-types";
import UserCard from "../card/UserCard";
import { useSelector } from "react-redux";
import Followbtn from "../btn/FollowBtn";
function Followings({ setShowFollowings, users }) {
  const { auth } = useSelector((state) => state);
  return (
    <>
      <div className="overlay" onClick={setShowFollowings} />
      <div className="follow">
        <div className="follow_box">
          <h5 className="text-center ">Followings</h5>
          <i className="far fa-times close" onClick={setShowFollowings}></i>
          <hr />
          {users.length > 0 ? (
            users.map((user) => (
              <UserCard key={user._id} user={user} onClick={setShowFollowings}>
                {auth.user._id !== user._id && <Followbtn user={user} />}
              </UserCard>
            ))
          ) : (
            <div className="no-follower">No Followings.!</div>
          )}
        </div>
      </div>
    </>
  );
}

Followings.propTypes = {
  user: PropTypes.array,
  setShowFollowings: PropTypes.func,
};

export default Followings;
