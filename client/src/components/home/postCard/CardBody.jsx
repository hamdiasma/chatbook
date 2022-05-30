import React from "react";
import PropTypes from "prop-types";
import Carousel from "../../carusel/Carousel";
import { useState } from "react";

function CardBody({ post, theme }) {
  const [readMore, setReadMore] = useState(false);
  const handelReadMore = () => {
    setReadMore(!readMore);
  };
  return (
    <div className="card_body">
      <div
        className="card_body_content"
        style={{
          filter: theme ? "invert(1)" : "invert(0)",
          color: theme ? "white" : "#111",
        }}
      >
        <span>
          {post.content.length < 60
            ? post.content
            : readMore
            ? post.content + ". "
            : post.content.slice(0, 60) + " ....."}
        </span>

        {post.content.length > 60 && (
          <small
            style={{ fontSize: "13px" }}
            className="readMore"
            onClick={handelReadMore}
          >
            {readMore ? "Hide content" : "Read More"}
          </small>
        )}
      </div>
      {post.images.length > 0 && (
        <Carousel images={post.images} id={post._id} />
      )}
    </div>
  );
}

CardBody.propTypes = {
  post: PropTypes.object,
};

export default CardBody;
