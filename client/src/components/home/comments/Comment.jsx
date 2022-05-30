import React, { useEffect, useState } from "react";
import CommentDisplay from "./CommentDispaly";
import PropTypes from "prop-types";

function Comment({ post, theme }) {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState([]);
  const [replyComments, setReplyComments] = useState([]);

  const [next, setNext] = useState(2);

  useEffect(() => {
    const newCm = post.comments.filter((cm) => !cm.reply);
    // .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    setComments(newCm);
    if (newCm.length > next) {
      setShowComments(newCm.slice(newCm.length - next));
    } else {
      setShowComments(newCm);
    }
  }, [post.comments, next]);

  useEffect(() => {
    const newReply = post.comments.filter((cm) => cm.reply);
    // .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    setReplyComments(newReply);
  }, [post.comments]);

  return (
    <div className="comments">
      {showComments
        .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        .map((comment, i) => (
          <CommentDisplay
            theme={theme}
            key={i}
            comment={comment}
            post={post}
            replyCm={replyComments.filter((item) => item.reply === comment._id)}
          />
        ))}
      {comments.length - next > 0 ? (
        <div
          className="p-2 border-top d-flex justify-content-between"
          style={{ filter: theme ? "invert(1)" : "invert(0)" }}
        >
          <small
            style={{ cursor: "pointer", color: "crimson" }}
            onClick={() => setNext(next + 5)}
          >
            see more comments..!
          </small>

          {showComments.length > 2 && (
            <small
              style={{ cursor: "pointer", color: "crimson" }}
              onClick={() => setNext(2)}
            >
              hide comments..!
            </small>
          )}
        </div>
      ) : (
        comments.length > 2 && (
          <div
            className="p-2 border-top"
            style={{ filter: theme ? "invert(1)" : "invert(0)" }}
          >
            <small
              style={{ cursor: "pointer", color: "crimson" }}
              onClick={() => setNext(2)}
            >
              hide comments..!
            </small>
          </div>
        )
      )}
    </div>
  );
}

Comment.propTypes = {
  post: PropTypes.object,
};

export default Comment;
