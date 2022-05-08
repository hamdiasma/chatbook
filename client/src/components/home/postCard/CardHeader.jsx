import React, { useState } from "react";
import PropTypes from "prop-types";
import Avatar from "../../avatar/Avatar";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { statusAction } from "../../../redux/actions/global";
import { deletePostAction } from "../../../redux/actions/post";
import { BASE_URL } from "../../../utils/config";

function CardHeader({ post }) {
  const dispatch = useDispatch();

  const { auth, socket } = useSelector((state) => state);
  const history = useHistory();
  const [copText, setCopText] = useState("");
  const handelEdit = () => {
    dispatch(statusAction({ ...post, onEdit: true }));
  };
  const handeldelete = () => {
    if (window.confirm("Press (Ok) to conifrme delete ")) {
      dispatch(deletePostAction({ post, auth, socket }));
      history.replace("/");
    }
  };
  const handelCopy = () => {
    navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`);
  };
  const isKeyDown = () => {
    setCopText("bg-success");
  };
  const isKeyUp = () => {
    setCopText("");
  };
  return (
    <div className="card_header">
      <div className="d-flex align-items-center">
        <Link to={`/profile/${post.user._id}`}>
          <Avatar src={post.user.avatar} size="large-avatar" />
        </Link>

        <div className="card_name mx-2">
          <h6>
            <Link to={`/profile/${post.user._id}`} className="text-dark">
              {post.user.username}
            </Link>
          </h6>
          <small
            style={{ fontSize: "10px", fontWeight: "bold" }}
            className="text-muted"
          >
            {moment(post.createdAt).fromNow()}
          </small>
        </div>
      </div>
      <div className="nav-item dropdown">
        <i
          className="far fa-ellipsis-v"
          id="moreLink"
          data-bs-toggle="dropdown"
          style={{ fontWeight: "900" }}
        ></i>
        <div className="dropdown-menu">
          {auth.user._id === post.user._id && (
            <>
              <div className="dropdown-item" onClick={handelEdit}>
                <i className="fas fa-pencil-alt"></i> Edit Post
              </div>
              <div className="dropdown-item" onClick={handeldelete}>
                <i className="fas fa-trash-alt"></i> Delete Post
              </div>
            </>
          )}
          <div
            className={`dropdown-item ${copText}`}
            onClick={handelCopy}
            onMouseDown={isKeyDown}
            onMouseOut={isKeyUp}
          >
            <i className="fas fa-copy"></i>{" "}
            {!copText ? " Copy Link" : " copied.!"}
          </div>
        </div>
      </div>
    </div>
  );
}

CardHeader.propTypes = {
  post: PropTypes.object,
};

export default CardHeader;
