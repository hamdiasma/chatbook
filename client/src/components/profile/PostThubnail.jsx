import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { statusAction } from "../../redux/actions/global";

function PostThubnail({ auth, posts, result, id, theme }) {
  const dispatch = useDispatch();
  useEffect(() => {}, []);
  if (result === 0)
    return (
      <>
        <h2 className="text-center text-danger">No Posts.!</h2>
        {id && id === auth.user._id && (
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-outline-info text-uppercase"
              onClick={() => dispatch(statusAction(true))}
            >
              add new post
            </button>
          </div>
        )}
      </>
    );
  return (
    <div className="post_thumb">
      {posts.map((post) => (
        <Link key={post._id} to={`/post/${post._id}`}>
          <div className="post_thumb_display">
            {post.images[0].url.match(/video/i) ? (
              <video
                src={post.images[0].url}
                controls
                className="d-block w-100"
                alt={post.images[0].url}
                style={{
                  height: "100%",
                  filter: theme ? "invert(1)" : "invert(0)",
                }}
              />
            ) : (
              <img
                src={post.images[0].url}
                alt={post.images[0].url}
                style={{ filter: theme ? "invert(1)" : "invert(0)" }}
              />
            )}
            <div className="post_thumb_menu">
              <i className="far fa-heart">{post.likes.length}</i>
              <i className="far fa-comment">{post.comments.length}</i>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

PostThubnail.propTypes = {
  auth: PropTypes.object,
  posts: PropTypes.array,
  result: PropTypes.number,
  id: PropTypes.string,
};

export default PostThubnail;
