import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CommentCard from "./CommentCard";

function CommentDispaly({ post, comment, replyCm, theme }) {
  const [showRep, setShowrep] = useState([]);
  const [next, setNext] = useState(1);
  useEffect(() => {
    if (replyCm.length > next) {
      setShowrep(replyCm.slice(replyCm.length - next));
    } else {
      setShowrep(replyCm);
    }
  }, [replyCm, next]);

  return (
    <div className="comment_display">
      <CommentCard
        post={post}
        comment={comment}
        commentId={comment._id}
        theme={theme}
      >
        <div style={{ paddingLeft: "20px" }} className="pl-3">
          {showRep.map(
            (item, i) =>
              item.reply && (
                <CommentCard
                  key={i}
                  post={post}
                  comment={item}
                  commentId={comment._id}
                  theme={theme}
                />
              )
          )}

          {replyCm.length - next > 0 ? (
            <div
              className="p-2 border-top d-flex justify-content-between"
              style={{ filter: theme ? "invert(1)" : "invert(0)" }}
            >
              <small
                style={{
                  cursor: "pointer",
                  color: "crimson",
                }}
                onClick={() => setNext(next + 2)}
              >
                see more comments..!
              </small>

              {replyCm.length > 2 && (
                <small
                  style={{ cursor: "pointer", color: "crimson" }}
                  onClick={() => setNext(1)}
                >
                  hide comments..!
                </small>
              )}
            </div>
          ) : (
            replyCm.length > 1 && (
              <div className="p-2 border-top">
                <small
                  style={{ cursor: "pointer", color: "crimson" }}
                  onClick={() => setNext(1)}
                >
                  hide comments..!
                </small>
              </div>
            )
          )}
        </div>
      </CommentCard>
    </div>
  );
}

CommentDispaly.propTypes = {
  post: PropTypes.object,
  comment: PropTypes.object,
  replyCm: PropTypes.array,
};
export default CommentDispaly;
