import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { followAction, unFollowAction } from "../../redux/actions/profile";
import { useEffect } from "react";
const Followbtn = ({ user }) => {
  const [followed, setFollowed] = useState(false);
  const { auth, profile, theme, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  useEffect(() => {
    let checkFollow = auth.user.following.every(
      (follow) => follow._id !== user._id
    );
    if (!checkFollow) {
      setFollowed(true);
    }

    return () => setFollowed(false);
  }, [auth.user, user._id]);

  const handelUnFollow = async () => {
    setFollowed(false);
    await dispatch(
      unFollowAction({ users: profile.users, auth, user, socket })
    );
  };
  const handelFollow = async () => {
    setFollowed(true);
    await dispatch(followAction({ users: profile.users, auth, user, socket }));
  };
  return (
    <>
      {followed ? (
        <button
          style={{
            fontSize: "12px",
            filter: theme ? "invert(1)" : "invert(0)",
          }}
          className="btn btn-outline-danger"
          onClick={handelUnFollow}
        >
          UnFollow
        </button>
      ) : (
        <button
          style={{
            fontSize: "12px",
            filter: theme ? "invert(1)" : "invert(0)",
          }}
          className="btn btn-outline-info"
          onClick={handelFollow}
        >
          Follow
        </button>
      )}
    </>
  );
};

Followbtn.propTypes = {
  user: PropTypes.object,
};

export default Followbtn;
