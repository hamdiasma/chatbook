import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

function LikeBtn({ isLike, handelLike, handelUnLike }) {
  const { theme } = useSelector((state) => state);

  return (
    <Fragment>
      {isLike ? (
        <i
          aria-hidden
          className="fas fa-heart text-danger"
          onClick={handelUnLike}
          style={{ filter: theme ? "invert(1)" : "invert(0)" }}
        ></i>
      ) : (
        <i aria-hidden className="far fa-heart" onClick={handelLike}></i>
      )}
    </Fragment>
  );
}

LikeBtn.propTypes = {
  handelLike: PropTypes.func,
  handelUnLike: PropTypes.func,
};

export default LikeBtn;
