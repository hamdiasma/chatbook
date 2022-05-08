import React from "react";
import PropTypes from "prop-types";
import LeftSide from "../../components/message/LeftSide";
import { useSelector } from "react-redux";

function Message() {
  const { theme } = useSelector((state) => state);
  return (
    <div className="message d-flex  ">
      <div className="col-md-4 border-right px-0 row_messsage">
        <LeftSide />
      </div>
      <div className="col-md-8 px-0 right_message">
        <div className="d-flex justify-content-center align-items-center flex-column h-100">
          <i
            className="fab fa-facebook-messenger text-primary"
            style={{
              fontSize: "4rem",
              filter: theme ? "invert(1)" : "invert(0)",
            }}
          />
          <h4>Messanger</h4>
        </div>
      </div>
    </div>
  );
}

Message.propTypes = {
  theme: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};

export default Message;
