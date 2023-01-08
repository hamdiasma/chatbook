import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { createCommentAction } from "../../../redux/actions/comment";
import Emojie from "../../emoji/Emojie";

function InputComment({ children, post, onReply, setOnReply }) {
  const [content, setContent] = useState("");
  // @ts-ignore
  const { auth, socket, theme } = useSelector((state) => state);
  const dispatch = useDispatch();
  const handelSubmit = (/** @type {React.MouseEvent<HTMLButtonElement, MouseEvent>} */ e) => {
    e.preventDefault();
    if (!content.trim()) {
      if (setOnReply) return setOnReply(false);
      return;
    }

    const newComment = {
      content,
      likes: [],
      user: auth.user,
      createdAt: new Date().toISOString(),
      reply: onReply && onReply.commentId,
      tag: onReply && onReply.user,
    };
    dispatch(createCommentAction(post, newComment, auth, socket));
    setContent("");
    if (setOnReply) return setOnReply(false);
  };

  return (
    <form className="card-footer comment-input">
      {children}
      <input
        type="text"
        placeholder="add comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          filter: theme ? "invert(1)" : "invert(0)",
          color: theme ? "white" : "#111",
          background: theme ? "#111" : "",
          border: theme ? "1px solid #c9c2c230" : "",
        }}
      />
      <Emojie content={content} setContent={setContent} theme={theme} />
      <button
        // type="button"
        className="btn btn-dark"
        onClick={(e) => handelSubmit(e)}
      >
        Post
      </button>
    </form>
  );
}

InputComment.propTypes = {
  children: PropTypes.node,
  post: PropTypes.object,
};

export default InputComment;
