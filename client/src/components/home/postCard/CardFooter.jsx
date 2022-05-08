import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Send from "../../../images/send.svg";
import { Link } from "react-router-dom";
import { useState } from "react";
import LikeBtn from "../../btn/LikeBtn";
import { useDispatch, useSelector } from "react-redux";
import {
  likePostAction,
  savePostAction,
  unLikePostAction,
  unSavePostAction,
} from "../../../redux/actions/post";
import ShareModel from "../../modal/ShareModel";
import { BASE_URL } from "../../../utils/config";
function CardFooter({ post }) {
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loadSaved, setLoadSaved] = useState(false);

  const { auth, theme, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  //== likes=== //
  useEffect(() => {
    if (post.likes.find((like) => like._id === auth.user._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [post.likes, auth.user]);

  const handelLike = async () => {
    if (loadLike) return;
    setIsLike(true);
    setLoadLike(true);
    dispatch(likePostAction({ post, auth, socket }));
    setLoadLike(false);
  };
  const handelUnLike = () => {
    if (loadLike) return;
    setIsLike(false);
    setLoadLike(true);
    dispatch(unLikePostAction({ post, auth, socket }));
    setLoadLike(false);
  };

  // ===likes=== //

  useEffect(() => {
    if (auth.user.saved.find((id) => id === post._id)) {
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }
  }, [auth.user.saved, post._id]);
  const handelSaved = () => {
    if (loadSaved) return;

    setIsSaved(true);
    setLoadSaved(true);
    dispatch(savePostAction({ post, auth }));
    setLoadSaved(false);
  };
  const handelUnSaved = () => {
    if (loadSaved) return;
    setIsSaved(false);
    setLoadSaved(true);
    dispatch(unSavePostAction({ post, auth }));
    setLoadSaved(false);
  };
  return (
    <div className="card_footer">
      <div className="card_icon_menu">
        <div>
          <LikeBtn
            isLike={isLike}
            handelLike={handelLike}
            handelUnLike={handelUnLike}
          />
          <Link to={`/post/${post._id}`} className="text-dark">
            <i aria-hidden className="far fa-comment"></i>
          </Link>
          <img src={Send} alt="send" onClick={() => setIsShare(!isShare)} />
        </div>
        {isSaved ? (
          <i
            aria-hidden
            className="fas fa-bookmark text-info"
            onClick={handelUnSaved}
            style={{ filter: theme ? "invert(1)" : "invert(0)" }}
          ></i>
        ) : (
          <i aria-hidden className="far fa-bookmark" onClick={handelSaved}></i>
        )}{" "}
      </div>
      <div className="d-flex justify-content-between">
        <h6 className="" style={{ padding: "0 25px", cursor: "pointer" }}>
          {post.likes.length} likes
        </h6>
        <h6 className="" style={{ padding: "0 25px", cursor: "pointer" }}>
          {post.comments.length} comments
        </h6>
      </div>
      <div>
        {isShare && <ShareModel url={`${BASE_URL}/post/${post._id}`} />}
      </div>
    </div>
  );
}

CardFooter.propTypes = {
  post: PropTypes.object,
};

export default CardFooter;
