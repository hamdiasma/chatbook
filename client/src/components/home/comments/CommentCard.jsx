import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Avatar from "../../avatar/Avatar";
import moment from "moment";
import LikeBtn from "../../btn/LikeBtn";
import { useDispatch, useSelector } from "react-redux";
import CommentMenu from "./CommentMenu";
import {
  likeCommentAction,
  unLikeCommentAction,
  updateCommentAction,
} from "../../../redux/actions/comment";
import InputComment from "../postCard/InputComment";

function CommentCard({ children, post, comment, commentId }) {
  const { auth, theme } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [readMore, setReadMore] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [onReply, setOnReply] = useState(false);

  useEffect(() => {
    setContent(comment.content);
    setIsLike(false);
    setOnReply(false);
    if (comment.likes.find((like) => like._id === auth.user._id)) {
      setIsLike(true);
    }
  }, [comment, auth.user._id]);

  const handelReadMore = () => {
    setReadMore(!readMore);
  };

  const handelLike = async () => {
    if (loadLike) return;
    setIsLike(true);
    setLoadLike(true);
    await dispatch(likeCommentAction({ comment, post, auth }));
    setLoadLike(false);
  };

  const handelUnLike = async () => {
    if (loadLike) return;
    setIsLike(false);
    setLoadLike(true);
    await dispatch(unLikeCommentAction({ comment, post, auth }));
    setLoadLike(false);
  };

  const handelUpdate = () => {
    if (comment.content !== content) {
      dispatch(updateCommentAction({ comment, content, post, auth }));
      setOnEdit(false);
    } else {
      setOnEdit(false);
    }
  };

  const handleReply = async () => {
    if (onReply) return setOnReply(false);
    setOnReply({ ...comment, commentId });
  };

  const styleCard = {
    opacity: comment._id ? 1 : 0.5,
    pointerEvents: comment._id ? "inherit" : "none",
  };

  return (
    <div className="comment_card mt-2" style={styleCard}>
      {comment.user && (
        <Link to={`/profile/${comment.user._id}`} className="d-flex text-dark">
          <Avatar src={comment.user.avatar} size="small-avatar" />
          <h6 className="mx-2">{comment.user.username}</h6>
        </Link>
      )}
      <div className="comment_content">
        <div
          className="flex-fill"
          style={{
            filter: theme ? "invert(1)" : "invert(0)",
            color: theme ? "white" : "#111",
          }}
        >
          {onEdit ? (
            <textarea
              rows="5"
              className=""
              style={{ width: "100%" }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          ) : (
            <>
              <span>
                {content.length < 100
                  ? comment.content
                  : readMore
                  ? comment.content + ". "
                  : content.slice(0, 100) + " ..... "}
              </span>
              {content.length > 60 && (
                <small
                  style={{ fontSize: "13px" }}
                  className="readMore"
                  onClick={handelReadMore}
                >
                  {readMore ? "Hide content" : "Read More"}
                </small>
              )}
            </>
          )}

          <div>
            <small className="text-muted">
              {moment(comment.createdAt).fromNow()}
            </small>
            <small
              className="font-weight-bold mx-2"
              style={{ cursor: "pointer" }}
            >
              {comment.likes.length} likes
            </small>
            {onEdit ? (
              <>
                <small
                  className="font-weight-bold mx-2 text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => handelUpdate()}
                >
                  update
                </small>

                <small
                  className="font-weight-bold mx-2 text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => setOnEdit(false)}
                >
                  cancel
                </small>
              </>
            ) : (
              <small
                className="font-weight-bold mx-2"
                style={{ cursor: "pointer" }}
                onClick={handleReply}
              >
                {onReply ? "cancel" : "reply"}
              </small>
            )}
          </div>
        </div>
        <div
          className="d-flex align-items-center"
          style={{ cursor: "pointer", paddingTop: "5px" }}
        >
          <CommentMenu
            theme={theme}
            post={post}
            comment={comment}
            auth={auth}
            onEdit={onEdit}
            setOnEdit={setOnEdit}
          />
          <LikeBtn
            isLike={isLike}
            handelLike={handelLike}
            handelUnLike={handelUnLike}
          />
        </div>
      </div>

      {onReply && (
        <InputComment post={post} onReply={onReply} setOnReply={setOnReply}>
          <Link to={`/profile/${onReply.user._id}`} className="m-1">
            <Avatar src={auth.user.avatar} size="small-avatar" />
          </Link>
        </InputComment>
      )}
      {children}
    </div>
  );
}

CommentCard.propTypes = {
  children: PropTypes.node,
  post: PropTypes.object,
  comment: PropTypes.object,
  commentId: PropTypes.string,
};

export default CommentCard;
