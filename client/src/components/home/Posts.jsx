import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../card/PostCard";
import LoadMoreBtn from "../btn/LoadMoreBtn";
import LoadingIcon from "../../images/480px-Loader.gif";
import { getData } from "../../utils/fetchData";
import { postTypes } from "../../redux/type/types";

function Posts() {
  const { homePosts, auth, theme } = useSelector((state) => state);
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  const handelLoadMore = async () => {
    setLoad(true);
    const res = await getData(`posts?limit=${homePosts.page * 9}`, auth.token);
    dispatch({
      type: postTypes.GET_POSTS,
      payload: { ...res.data, page: homePosts.page + 1 },
    });
    setLoad(false);
  };

  return (
    <div className="post">
      {homePosts.posts.map((post) => {
        return <PostCard post={post} key={post._id} theme={theme} />;
      })}

      {load && (
        <img
          src={LoadingIcon}
          width="200px"
          alt="loading"
          className="d-block mx-auto"
        />
      )}

      <LoadMoreBtn
        result={homePosts.result}
        page={homePosts.page}
        load={load}
        handelLoadMore={handelLoadMore}
      />
    </div>
  );
}

Posts.propTypes = {
  homePosts: PropTypes.object,
};

export default Posts;
