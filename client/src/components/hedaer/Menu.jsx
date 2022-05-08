import React from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { logOutAction } from "../../redux/actions/auth";
import Avatar from "../avatar/Avatar";
import { themeAction } from "../../redux/actions/global";
import NotifyModal from "../modal/NotifyModal";

function Menu() {
  const dispatch = useDispatch();

  const navLinks = [
    { label: "Home", icon: "fa fa-home", path: "/" },
    { label: "Message", icon: "fas fa-location-arrow", path: "/message" },
    { label: "Discovre", icon: "fas  fa-compass ", path: "/discover" },
  ];
  const { auth, theme, notify } = useSelector((state) => state);
  const { pathname } = useLocation();
  const isActive = (page) => {
    if (page === pathname) {
      return "active";
    } else {
      return "";
    }
  };
  return (
    <div className="menu">
      <ul className="navbar-nav flex-row  mb-lg-0">
        {navLinks.map((navlink, i) => (
          <li className={`nav-item px-2 ${isActive(navlink.path)}`} key={i}>
            <Link className="nav-link " aria-current="page" to={navlink.path}>
              <span className="material-icons-outlined">
                <i
                  className={`${navlink.icon} `}
                  style={{
                    filter: theme ? "invert(1)" : "invert(0)",
                    color: theme ? "#ccc" : "",
                  }}
                ></i>
              </span>
            </Link>
          </li>
        ))}
        <li className="nav-item  px-2 dropdown">
          <span
            className="nav-link position-relative"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span className="material-icons-outlined">
              <i className="fas fa-bell"></i>
            </span>
            {notify.data.length > 0 && (
              <span className="notify">
                <small>{notify.data.length}</small>
              </span>
            )}
          </span>
          <div className="dropdown-menu notif" aria-labelledby="navbarDropdown">
            <NotifyModal notify={notify} auth={auth} theme={theme} />
          </div>
        </li>

        <li className="nav-item dropdown">
          <span
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <Avatar src={auth.user.avatar} size={"medium-avatar"} />
          </span>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <Link className="dropdown-item" to={`/profile/${auth.user._id}`}>
              <i className="fas fa-user"></i> Profile
            </Link>
            <label
              className="dropdown-item"
              htmlFor="theme"
              onClick={() => dispatch(themeAction(!theme))}
            >
              {!theme ? (
                <>
                  {" "}
                  <i
                    className="fas fa-moon"
                    style={{ filter: theme ? "invert(1)" : "invert(0)" }}
                  ></i>{" "}
                  dark
                </>
              ) : (
                <>
                  {" "}
                  <i
                    className="far fa-sun"
                    style={{ filter: theme ? "invert(1)" : "invert(0)" }}
                  ></i>{" "}
                  light
                </>
              )}
            </label>
            <hr className="dropdown-divider" />
            <Link
              className="dropdown-item"
              to="/"
              onClick={() => dispatch(logOutAction())}
            >
              logout
            </Link>
          </ul>
        </li>
      </ul>
    </div>
  );
}

Menu.propTypes = {
  auth: PropTypes.object,
  theme: PropTypes.bool,
  navLinks: PropTypes.array,
};

export default Menu;
