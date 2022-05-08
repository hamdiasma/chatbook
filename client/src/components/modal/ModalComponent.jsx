import React, { Fragment, useRef } from "react";
import PropTypes from "prop-types";

const Modalcomponent = ({ children, open, handelOpen, headerModal }) => {
  return (
    <Fragment>
      <div
        className={`modal ${open ? "show" : "fade"}`}
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
      >
        <div
          id="modal-ref"
          className="modal-dialog modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {headerModal}
              </h5>
              <button
                type="button"
                className=" btn btn-danger close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handelOpen}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
      <div className={`overlay-modal ${open && "open"}`} onClick={handelOpen} />
    </Fragment>
  );
};

Modalcomponent.propTypes = {};

export default Modalcomponent;
