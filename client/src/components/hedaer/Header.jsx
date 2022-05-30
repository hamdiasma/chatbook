import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { APP_NAME } from "../../utils/config";
import Menu from "./Menu";
import Search from "./Search";
import RubberBand from "react-reveal/RubberBand";
function Header() {
  const { theme } = useSelector((state) => state);
  return (
    <div
      className="header pl-1"
      style={{
        filter: theme ? "invert(1)" : "invert(0)",
        color: theme ? "#ccc" : "",
      }}
    >
      <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between align-middle">
        <span className="logo_app">
          <Link
            className="navbar-brand logo d-flex align-items-center "
            to="/"
            onClick={() => window.scrollTo({ top: 0 })}
          >
            <img src="/social.svg" alt="" />
            <RubberBand>
              <h1
                className="text_app p-0 m-0"
                style={{
                  filter: theme ? "invert(1)" : "invert(0)",
                  color: theme ? "#7e4c6b" : "",
                  textShadow: theme ? "3px 4px 4px rgba(58, 58, 58, 0.66)" : "",
                }}
              >
                {APP_NAME}
              </h1>
            </RubberBand>
          </Link>
        </span>
        <Search />
        <Menu />
      </nav>
    </div>
  );
}

export default Header;
