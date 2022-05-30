import React from "react";
import Posts from "../components/home/Posts";
import Status from "../components/home/Status";
import { useSelector } from "react-redux";
import LoadinIcon from "../images/480px-Loader.gif";
import RightSideBar from "../components/home/RightSideBar";
import NoPost from "../images/nopost.webp";
function Home(props) {
  const { homePosts, theme } = useSelector((state) => state);
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
          <div className="nopost">
            <img
              style={{ filter: theme ? "invert(1)" : "invert(0)" }}
              src={NoPost}
              alt=""
              className="nopost_img"
            />
          </div>
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
