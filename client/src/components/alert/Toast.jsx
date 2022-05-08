import React from "react";
import PropTypes from "prop-types";
function Toast({ msg, handelSHow, bgColor }) {
  return (
    <div
      className={`toast show position-fixed text-light ${bgColor}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ top: "5px", right: "5px", zIndex: 55 }}
    >
      <div className={`toast-header text-light ${bgColor}`}>
        <strong className="me-auto text-light">Alert..!</strong>
        <small>11 mins ago</small>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
          style={{ outline: "none" }}
          onClick={handelSHow}
        ></button>
      </div>
      <div className="toast-body">{msg}</div>
    </div>
  );
}

Toast.propTypes = {
  msg: PropTypes.string.isRequired,
  handelSHow: PropTypes.func.isRequired,
  bgColor: PropTypes.string.isRequired,
};

export default Toast;
