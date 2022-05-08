import React, { useState } from "react";
import PropTypes from "prop-types";
import Posts from "../components/home/Posts";
import Status from "../components/home/Status";
import { useSelector } from "react-redux";
import LoadinIcon from "../images/480px-Loader.gif";
import RightSideBar from "../components/home/RightSideBar";
function Home(props) {
  const { homePosts } = useSelector((state) => state);
  return (
    <div className="home row mx-0">
      <div className="col-md-8">
        <Status />
        {homePosts.loading ? (
          <img
            src={LoadinIcon}
            alt="loading"
            width={100}
            className="d-block mx-auto"
          />
        ) : homePosts.result === 0 && homePosts.posts.length === 0 ? (
          <h2>No Posts..!</h2>
        ) : (
          <Posts />
        )}
      </div>
      <div className="col-md-4">
        <RightSideBar />
      </div>
    </div>
  );
}

Home.propTypes = {};

export default Home;
