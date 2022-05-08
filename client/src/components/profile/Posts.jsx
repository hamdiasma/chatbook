import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PostThubnail from "./PostThubnail";
import LoadMoreBtn from "../btn/LoadMoreBtn";
import LoadingIcon from "../../images/480px-Loader.gif";
import { getData } from "../../utils/fetchData";
import { profileTypes } from "../../redux/type/types";

function Posts({ auth, profile, id, dispatch, theme }) {
  const [posts, setPosts] = useState([]);
  const [result, setResult] = useState(9);
  const [load, setload] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    profile.posts.forEach((data) => {
      if (data._id === id) {
        setPosts(data.posts);
        setResult(data.result);
        setPage(data.page);
      }
    });
  }, [profile.posts, id]);
  const handelLoadMore = async () => {
    setload(true);
    const res = await getData(`user_posts/${id}?limit=${page * 9}`, auth.token);
    const newData = { ...res.data, page: page + 1, _id: id };
    dispatch({
      type: profileTypes.UPDATE_PROFILE_POST,
      payload: newData,
    });
    setload(false);
  };
  return (
    <div>
      <PostThubnail
        auth={auth}
        id={id}
        posts={posts}
        theme={theme}
        result={result}
      />

      {load && (
        <img
          src={LoadingIcon}
          width="200px"
          alt="loading"
          className="d-block mx-auto"
        />
      )}

      <LoadMoreBtn
        result={result}
        page={page}
        load={load}
        handelLoadMore={handelLoadMore}
      />
    </div>
  );
}

Posts.propTypes = {};

export default Posts;
