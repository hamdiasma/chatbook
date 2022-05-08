import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPost } from "../../redux/actions/post";
import LoadingIcon from "../../images/480px-Loader.gif";
import PostCard from "../../components/card/PostCard";

function PostPage(props) {
  const { id } = useParams();
  const [post, setPost] = useState([]);
  const { auth, detailPost } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPost({ detailPost, id, auth }));
    if (detailPost.length > 0) {
      const newArr = detailPost.filter((post) => post._id === id);
      setPost(newArr);
    }
  }, [detailPost, dispatch, auth, id]);

  return (
    <div className="post post_detail_page">
      {post.length === 0 && (
        <img src={LoadingIcon} alt="loading" className="d-block mx-auto my-4" />
      )}
      {post.map((item) => (
        <PostCard key={item._id} post={item} />
      ))}
    </div>
  );
}

PostPage.propTypes = {};

export default PostPage;
