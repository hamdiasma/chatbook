import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PostThubnail from "./PostThubnail";
import LoadMoreBtn from "../btn/LoadMoreBtn";
import LoadingIcon from "../../images/480px-Loader.gif";
import { getData } from "../../utils/fetchData";
import { alertAction } from "../../redux/actions/alert";

function Saved({ auth, dispatch, theme }) {
  const [savePosts, setSavePosts] = useState([]);
  const [result, setResult] = useState(9);
  const [load, setload] = useState(false);
  const [page, setPage] = useState(2);

  useEffect(() => {
    setload(true);
    getData("getSavePost", auth.token)
      .then((res) => {
        setSavePosts(res.data.savePosts);
        setResult(res.data.result);
        setload(false);
      })
      .catch((error) =>
        dispatch(alertAction({ error: error.response.data.msg }))
      );
    // return () => setSavePosts([]);
  }, [dispatch, auth.token]);
  const handelLoadMore = async () => {
    setload(true);
    const res = await getData(`getSavePost?limit=${page * 9}`, auth.token);

    setSavePosts([...res.data.savePosts]);
    setResult(res.data.result);
    setPage(page + 1);
    setload(false);
  };
  return (
    <div>
      <PostThubnail
        auth={auth}
        posts={savePosts}
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

Saved.propTypes = {
  auth: PropTypes.object,
};

export default Saved;
