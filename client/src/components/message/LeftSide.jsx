import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import UserCard from "../card/UserCard";
import { useDispatch, useSelector } from "react-redux";
import { alertAction } from "../../redux/actions/alert";
import { getData } from "../../utils/fetchData";
import LoadingIcon from "../../images/480px-Loader.gif";
import { useHistory } from "react-router-dom";
import { getConversationAction } from "../../redux/actions/message";
import { messageTypes } from "../../redux/type/types";
import Followbtn from "../btn/FollowBtn";

function LeftSide({ id }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [load, setLoad] = useState(false);

  const { auth, message, online, theme } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const pageEnd = useRef();
  const [page, setPage] = useState(0);

  const handelClick = async (e) => {
    e.preventDefault();
    if (!e.target.value) {
      return setUsers([]);
    }
    try {
      setLoad(true);
      const res = await getData(
        `search?username=${e.target.value.toLowerCase()}`,
        auth.token
      );

      setTimeout(() => {
        let newUsers = [];
        if (res.data.users.length > 0) {
          res.data.users.map((user) =>
            online.includes(user._id)
              ? newUsers.push({ ...user, online: true })
              : newUsers.push({ ...user, online: false })
          );
        }

        setUsers(newUsers);
        setLoad(false);
      }, 50);
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };
  const handelAddUserChat = (user) => {
    setSearch("");
    setUsers([]);

    dispatch({
      type: messageTypes.ADD_USER,
      payload: { ...user, text: "", media: [] },
    });
    return history.push(`/message/${user._id}`);
  };
  const isActiveUserMessagePage = (user) => {
    if (id === user._id) {
      return "active_user_conversation";
    } else {
      return "";
    }
  };
  useEffect(() => {
    if (message.firstLoad) return;
    dispatch(getConversationAction({ auth }));
  }, [dispatch, auth, message.firstLoad]);

  useEffect(() => {
    let observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(pageEnd.current);
  }, [setPage]);

  useEffect(() => {
    if (message.resultUsers >= (page - 1) * 9 && page > 1) {
      dispatch(getConversationAction({ auth, page }));
    }
  }, [dispatch, message.resultUsers, auth, page]);

  // check user online - offline

  useEffect(() => {
    if (message.firstLoad)
      dispatch({
        type: messageTypes.CHECK_ONLINE_OFFLINE,
        payload: online,
      });
  }, [online, message.firstLoad, dispatch]);

  const userOnlineOrOffline = (user) => {
    let newUser = { ...user, followers: [], following: [] };
    if (user.online) {
      return (
        <i
          className="fas fa-circle text-success"
          style={{ filter: theme ? "invert(1)" : "invert(0)" }}
        ></i>
      );
    } else {
      return auth.user.following.find((item) => item._id === user._id) ? (
        <i className="fas fa-circle "></i>
      ) : (
        <Followbtn user={newUser} />
      );
    }
  };

  return (
    <>
      <form className="message_header d-flex">
        <input
          type="text"
          placeholder="Enter to search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handelClick(e);
          }}
        />

        <button type="submit" id="search">
          search
        </button>
      </form>

      <div className="message_chat_list">
        {load && users.length === 0 ? (
          <img
            src={LoadingIcon}
            alt="loading"
            className="d-block mx-auto w-100 my-4"
          />
        ) : (
          <>
            {users.length !== 0 ? (
              <>
                {users
                  .filter((user) => user._id !== auth.user._id)
                  .map((user) => (
                    <div
                      key={user._id}
                      className="message_user pointer"
                      onClick={() => handelAddUserChat(user)}
                    >
                      <UserCard user={user} isNotLink>
                        {userOnlineOrOffline(user)}
                      </UserCard>
                    </div>
                  ))}
              </>
            ) : (
              <>
                {message.users.map((user) => (
                  <div
                    key={user._id}
                    className={`message_user pointer ${isActiveUserMessagePage(
                      user
                    )}`}
                    onClick={() => handelAddUserChat(user)}
                  >
                    <UserCard user={user} msg={true} isNotLink>
                      {userOnlineOrOffline(user)}
                    </UserCard>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        <button ref={pageEnd} style={{ opacity: 0 }}>
          load more
        </button>
      </div>
    </>
  );
}

LeftSide.propTypes = {
  id: PropTypes.string,
};

export default LeftSide;
