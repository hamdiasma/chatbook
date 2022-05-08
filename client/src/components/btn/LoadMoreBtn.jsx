import React from "react";
import PropTypes from "prop-types";

function LoadMoreBtn({ result, page, load, handelLoadMore }) {
  return (
    <>
      {result < 9 * (page - 1)
        ? ""
        : !load && (
            <button
              className="btn btn-dark load_more mx-auto d-block"
              onClick={handelLoadMore}
            >
              Load More
            </button>
          )}
    </>
  );
}

LoadMoreBtn.propTypes = {
  page: PropTypes.number.isRequired,
  result: PropTypes.number.isRequired,
  load: PropTypes.bool.isRequired,
  handelLoadMore: PropTypes.func.isRequired,
};

export default LoadMoreBtn;
