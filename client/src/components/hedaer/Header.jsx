import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { APP_NAME } from "../../utils/config";
import Menu from "./Menu";
import Search from "./Search";

function Header() {
  const { theme } = useSelector((state) => state);
  return (
    <div className="header bg-light pl-1">
      <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between align-middle">
        <span className="logo_app">
          <Link
            className="navbar-brand logo d-flex align-items-center "
            to="/"
            onClick={() => window.scrollTo({ top: 0 })}
          >
            <img
              src="/social.svg"
              alt=""
              style={{ filter: theme ? "invert(1)" : "invert(0)" }}
            />
            <h1 className="navbar-brand text-uppercase p-0 m-0">{APP_NAME}</h1>
          </Link>
        </span>
        <Search />
        <Menu />
      </nav>
    </div>
  );
}

export default Header;
