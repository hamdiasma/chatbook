import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { discoverAction } from "../redux/actions/discover";
import LoadingIcon from "../images/480px-Loader.gif";
import PostThubnail from "../components/profile/PostThubnail";
import LoadMoreBtn from "../components/btn/LoadMoreBtn";
import { getData } from "../utils/fetchData";
import { discoverTypes } from "../redux/type/types";

function Discover(props) {
  const { auth, discover, theme } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [load, setload] = useState(false);

  useEffect(() => {
    if (!discover.firstLoad) {
      dispatch(discoverAction(auth.token));
    }
  }, [dispatch, auth.token, discover.firstLoad]);

  const handelLoadMore = async () => {
    setload(true);
    const res = await getData(
      `post_discover?num=${discover.page * 9}`,
      auth.token
    );
    dispatch({
      type: discoverTypes.UPDATE_DISCOVER_POSTS,
      payload: res.data,
    });
    setload(false);
  };
  return (
    <div>
      {discover.loading ? (
        <img
          src={LoadingIcon}
          alt="loading"
          className="d-block mx-auto  my-4"
        />
      ) : (
        <PostThubnail
          auth={auth}
          posts={discover.posts}
          theme={theme}
          result={discover.result}
        />
      )}
      {load && (
        <img
          src={LoadingIcon}
          width="200px"
          alt="loading"
          className="d-block mx-auto"
        />
      )}
      {!discover.loading && (
        <LoadMoreBtn
          result={discover.result}
          page={discover.page}
          load={discover.loading}
          handelLoadMore={handelLoadMore}
        />
      )}
    </div>
  );
}

Discover.propTypes = {};

export default Discover;
