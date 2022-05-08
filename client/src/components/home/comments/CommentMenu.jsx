import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { deleteCommentAction } from "../../../redux/actions/comment";

function CommentMenu({ post, comment, auth, setOnEdit }) {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state);
  const hendelRemove = () => {
    if (post.user._id === auth.user._id || comment.user._id === auth.user._id) {
      dispatch(deleteCommentAction({ post, auth, comment, socket }));
    }
  };

  const menuItem = () => {
    return (
      <>
        <div className="dropdown-item" onClick={() => setOnEdit(true)}>
          <i className="fas fa-pencil-alt"></i> Edit Post
        </div>
        <div className="dropdown-item" onClick={hendelRemove}>
          <i className="fas fa-trash-alt"></i> Delete Post
        </div>
      </>
    );
  };

  return (
    <div className="menu mx-1">
      {(post.user._id === auth.user._id ||
        comment.user._id === auth.user._id) && (
        <div className="nav-item dropdown">
          <i
            className="far fa-ellipsis-v"
            id="moreLink"
            data-bs-toggle="dropdown"
            style={{ fontWeight: "900" }}
          ></i>
          <div className="dropdown-menu" aria-labelledby="moreLink">
            {post.user._id === auth.user._id ? (
              comment.user._id === auth.user._id ? (
                menuItem()
              ) : (
                <div className="dropdown-item" onClick={hendelRemove}>
                  <i className="fas fa-trash-alt"></i> Delete Post
                </div>
              )
            ) : (
              comment.user._id === auth.user._id && menuItem()
            )}
          </div>
        </div>
      )}
    </div>
  );
}

CommentMenu.propTypes = {
  post: PropTypes.object,
  comment: PropTypes.object,
  auth: PropTypes.object,
};

export default CommentMenu;
