import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function AccountDescription({ text, url, urlText }) {
  return (
    <p className="mt-3">
      {text}{" "}
      <Link to={url} style={{ color: "crimson" }}>
        {urlText}
      </Link>
    </p>
  );
}

AccountDescription.propTypes = {
  text: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  urlText: PropTypes.string.isRequired,
};

export default AccountDescription;
