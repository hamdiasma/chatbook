import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

function Avatar({ src, size, ...otherProps }) {
  const { theme } = useSelector((state) => state);
  return (
    <>
      <img
        className={`user_avatar  ${size}`}
        src={src}
        alt="avatar"
        style={{ filter: theme ? "invert(1)" : "invert(0)" }}
        {...otherProps}
      />
    </>
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  theme: PropTypes.bool,
};

export default Avatar;
