import React from "react";
import PropTypes from "prop-types";
import LeftSide from "../../components/message/LeftSide";
import RightSlide from "../../components/message/RightSlide";
import { useParams } from "react-router-dom";

function Conversation() {
  const { id } = useParams();
  return (
    <div className="message d-flex ">
      <div className="col-md-4 border-right px-0 left_message">
        <LeftSide id={id} />
      </div>
      <div className="col-md-8 px-0 row_messsage">
        <RightSlide />
      </div>
    </div>
  );
}

Conversation.propTypes = {
  id: PropTypes.string,
};

export default Conversation;
