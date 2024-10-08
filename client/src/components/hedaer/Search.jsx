import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { alertAction } from "../../redux/actions/alert";
import { getData } from "../../utils/fetchData";
import { lowerText } from "../../utils/lowerCasetext";
import UserCard from "../card/UserCard";
import LoadingImg from "../../images/loading.gif";
function Search() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();

  const { auth, theme } = useSelector((state) => state);

  const handelSearch = async (e) => {
    e.preventDefault();
    if (!search) {
      setUsers([]);
      return;
    }
    try {
      setLoad(true);
      const res = await getData(`search?username=${search}`, auth.token);
      setTimeout(() => {
        setUsers(res.data.users);
        setLoad(false);
      }, 1000);
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

  const handelClose = () => {
    setSearch("");
    setUsers([]);
    window.scrollTo(0, 0);
  };

  return (
    <form
      className="search-form"
      autoComplete="new-password"
      onSubmit={handelSearch}
    >
      <input
        className={theme ? "search-darck" : "search-light"}
        style={{
          filter: theme ? "invert(1)" : "invert(0)",
          background: theme ? "#ffffff42" : "",
          color: theme ? "#fff" : "",
          border: theme ? "1px solid #dddddd0d" : "1px solid  #e0dada",
        }}
        autoComplete="off"
        type="text"
        name="search"
        value={search}
        id="search"
        onChange={(e) => {
          if (!e.isTrusted) return;
          setSearch(lowerText(e.target.value));
        }}
      />
      <div className="search_icon" style={{ opacity: search ? 0 : 0.3 }}>
        <i className="fas fa-search"></i>
        <span>Search</span>
      </div>
      {load ? (
        <img
          src={LoadingImg}
          alt="loading"
          className="loading-search"
          role="status"
        />
      ) : (
        <div
          className="close_search"
          style={{ display: search ? "block" : "none", color: "crimson" }}
          onClick={handelClose}
        >
          &times;
        </div>
      )}
      <button style={{ display: "none" }} type="submit">
        submit
      </button>

      <div
        className="users_results"
        style={{
          filter: theme ? "invert(1)" : "invert(0)",
          background: theme ? "#ffffff42" : "",
          opacity: theme ? 1 : 1,
        }}
      >
        {search &&
          users.length > 0 &&
          users.map((user) => (
            <div key={user._id} onClick={handelClose}>
              <UserCard user={user} border="border" />
            </div>
          ))}
      </div>
    </form>
  );
}

export default Search;
