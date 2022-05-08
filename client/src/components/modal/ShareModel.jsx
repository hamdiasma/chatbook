import React from "react";
import PropTypes from "prop-types";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LineIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  RedditShareButton,
  RedditIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
} from "react-share";
import { useSelector } from "react-redux";
function ShareModel({ url }) {
  const { theme } = useSelector((state) => state);
  return (
    <div
      className="share_modal d-flex justify-content-around p-4"
      style={{ filter: theme ? "invert(1)" : "invert(0)" }}
    >
      <FacebookShareButton url={url}>
        <FacebookIcon size={32} round={true} />
      </FacebookShareButton>
      <TwitterShareButton url={url}>
        <TwitterIcon size={32} round={true} />
      </TwitterShareButton>
      <WhatsappShareButton url={url}>
        <WhatsappIcon size={32} round={true} />
      </WhatsappShareButton>
      <LinkedinShareButton url={url}>
        <LineIcon size={32} round={true} />
      </LinkedinShareButton>
      <FacebookMessengerShareButton url={url}>
        <FacebookMessengerIcon size={32} round={true} />
      </FacebookMessengerShareButton>
      <EmailShareButton url={url}>
        <EmailIcon size={32} round={true} />
      </EmailShareButton>
      <TelegramShareButton url={url}>
        <TelegramIcon size={32} round={true} />
      </TelegramShareButton>
      <RedditShareButton url={url}>
        <RedditIcon size={32} round={true} />
      </RedditShareButton>
    </div>
  );
}

ShareModel.propTypes = {
  url: PropTypes.string,
};

export default ShareModel;
