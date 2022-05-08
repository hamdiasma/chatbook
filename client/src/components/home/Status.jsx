import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../avatar/Avatar";
import { statusAction } from "../../redux/actions/global";

function Status(props) {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  return (
    <div className="status my-3 d-flex align-items-center">
      <Avatar src={auth.user.avatar} size="small-avatar" />
      <button
        onClick={() => dispatch(statusAction(true))}
        className="statusBtn flex-fill"
      >
        Add New Post..?
      </button>
    </div>
  );
}

Status.propTypes = {
  auth: PropTypes.object,
};

export default Status;
