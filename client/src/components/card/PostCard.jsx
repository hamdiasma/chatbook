import React from "react";
import PropTypes from "prop-types";
import CardHeader from "../home/postCard/CardHeader";
import CardBody from "../home/postCard/CardBody";
import CardFooter from "../home/postCard/CardFooter";
import Comment from "../home/comments/Comment";
import InputComment from "../home/postCard/InputComment";

function PostCard({ post, theme }) {
  return (
    <div className="card my-3">
      <CardHeader post={post} theme={theme} />
      <CardBody post={post} theme={theme} />
      <CardFooter post={post} theme={theme} />
      <InputComment post={post} theme={theme} />
      <Comment post={post} theme={theme} />
    </div>
  );
}

PostCard.propTypes = { post: PropTypes.object };

export default PostCard;
