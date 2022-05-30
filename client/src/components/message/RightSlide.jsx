import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import UserCard from "../card/UserCard";
import MessageDisplay from "./MessageDisplay";
import { alertAction } from "../../redux/actions/alert";
import { imageShow, videoShow } from "../../utils/mediaShow";
import Emojie from "../emoji/Emojie";
import { imageUploade } from "../../utils/imageUpload";
import {
  addMessageAction,
  deleteConversationAction,
  getMessagesAction,
  loadMoreMessagesAction,
} from "../../redux/actions/message";
import IconLoad from "../../images/480px-Loader.gif";
import { scrollSmoth } from "../../utils/scrollSmooth";
import { intersectionOnbs } from "../../utils/intersectionObs";
import { globalTypes } from "../../redux/type/types";
import audioBlip1 from "../../audio/sendNotify.wav";
import audioBlip2 from "../../audio/delete.wav";
function RightSlide() {
  const { auth, message, theme, socket, peer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [medias, setMedias] = useState([]);
  const [text, setText] = useState("");
  const [loadMedia, setLoadMediat] = useState(false);
  const refDisplay = useRef();
  const pageEnd = useRef();
  const audioRef = useRef();
  const audioDeleteRef = useRef();
  const [data, setData] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(0);

  useEffect(() => {
    const newdata = message.data.find((item) => item._id === id);

    if (newdata) {
      setData(newdata.messages);
      setResult(newdata.result);
      setPage(newdata.page);
    }
  }, [message.data, id]);

  useEffect(() => {
    if (id && message.users.length > 0) {
      setTimeout(() => {
        if (refDisplay.current) scrollSmoth(refDisplay.current);
      }, 50);

      const newUser = message.users.find((user) => user._id === id);
      if (newUser) setUser(newUser);
    }
  }, [message.users, id]);

  const handelChange = (e) => {
    let files = [...e.target.files];
    let err = "";
    let newMedias = [];

    files.forEach((file) => {
      if (!file) return (err = "file does not exist.");
      if (file.size > 1024 * 1024 * 5) {
        return (err = "The image/video largest is 5mb.");
      }

      return newMedias.push(file);
    });
    if (err) dispatch(alertAction({ error: err }));
    setMedias([...medias, ...newMedias]);
  };
  const handelDelete = (i) => {
    let newArr = [...medias];
    newArr.splice(i, 1);
    setMedias(newArr);
  };
  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && medias.length === 0) {
      return;
    }
    setTimeout(() => {
      if (refDisplay.current) scrollSmoth(refDisplay.current);
    }, 50);
    setText("");
    setMedias([]);
    setLoadMediat(true);

    let newArr = [];
    if (medias.length > 0) newArr = await imageUploade(medias);
    const msg = {
      sender: auth.user._id,
      recipient: id,
      text,
      media: newArr,
      createdAt: new Date().toISOString(),
    };
    setLoadMediat(false);
    await dispatch(
      addMessageAction({ msg, auth, socket, users: message.users })
    );
    audioRef.current.play();
    setTimeout(() => {
      if (refDisplay.current) scrollSmoth(refDisplay.current);
    }, 50);
  };

  useEffect(() => {
    const getMessages = async () => {
      if (message.data.every((item) => item._id !== id)) {
        await dispatch(getMessagesAction({ auth, id }));
        setTimeout(() => {
          if (refDisplay.current) scrollSmoth(refDisplay.current);
        }, 50);
      }
    };
    getMessages();
  }, [dispatch, id, auth, message.data]);

  // loadMore message
  useEffect(() => {
    intersectionOnbs(pageEnd.current, setIsLoadMore);
  }, [setIsLoadMore]);

  useEffect(() => {
    if (isLoadMore > 1) {
      if (result >= page * 9) {
        dispatch(loadMoreMessagesAction({ auth, id, page: page + 1 }));
        setIsLoadMore(1);
      }
    }
  }, [isLoadMore, auth, dispatch, id, page, result]);

  const handelDeleteConversation = (id) => {
    if (window.confirm("are you want to delete conversation?")) {
      dispatch(deleteConversationAction({ id, auth }));
      audioDeleteRef.current.play();
      return history.push("/message");
    }
  };

  // call
  const caller = ({ video }) => {
    const { _id, avatar, fullname, username } = user;
    const msg = {
      sender: auth.user._id,
      recipient: _id,
      avatar,
      fullname,
      username,
      video,
    };
    dispatch({
      type: globalTypes.CALL,
      payload: msg,
    });
  };

  const callUser = ({ video }) => {
    const { _id, avatar, fullname, username } = auth.user;
    const msg = {
      sender: _id,
      recipient: user._id,
      avatar,
      fullname,
      username,
      video,
    };

    if (peer.open) msg.peerId = peer._id;
    socket.emit("callUser", msg);
  };

  const handelCallPhone = () => {
    caller({ video: false });
    callUser({ video: false });
  };
  const handelCallVideo = () => {
    caller({ video: true });
    callUser({ video: true });
  };

  return (
    <>
      <div className="message_header">
        {user.length !== 0 && (
          <UserCard user={user}>
            <div className="message_options">
              <i
                className="fas fa-phone pointer"
                style={{
                  filter: theme ? "invert(1)" : "invert(0)",
                  color: "#58b4e3",
                }}
                onClick={() => handelCallPhone(id)}
              ></i>
              <i
                className="fas fa-video mx-3 pointer"
                style={{
                  filter: theme ? "invert(1)" : "invert(0)",
                  color: "#329c0cd1",
                }}
                onClick={() => handelCallVideo(id)}
              ></i>
              <i
                className="fas fa-trash text-danger pointer"
                style={{ filter: theme ? "invert(1)" : "invert(0)" }}
                onClick={() => handelDeleteConversation(id)}
              ></i>
            </div>
          </UserCard>
        )}
      </div>
      <div
        className="chat_container"
        style={{
          height:
            medias.length > 0 ? "calc(100% - 185px)" : "calc(100% - 112px)",
        }}
      >
        <div className="chat_display" ref={refDisplay}>
          <button style={{ marginTop: "-25px", opacity: 0 }} ref={pageEnd}>
            load more
          </button>

          {data &&
            data.length > 0 &&
            data.map((msg, i) => (
              <div key={i}>
                {msg.sender !== auth.user._id && (
                  <div className="chat_row other_message">
                    <MessageDisplay
                      audioDeleteRef={audioDeleteRef}
                      user={user}
                      msg={msg}
                      theme={theme}
                      handelCallPhone={handelCallPhone}
                      handelCallVideo={handelCallVideo}
                    />
                  </div>
                )}
                {msg.sender === auth.user._id && (
                  <div className="chat_row your_message">
                    <MessageDisplay
                      user={auth.user}
                      msg={msg}
                      theme={theme}
                      data={data}
                      handelCallPhone={handelCallPhone}
                      handelCallVideo={handelCallVideo}
                      audioDeleteRef={audioDeleteRef}
                    />
                  </div>
                )}
              </div>
            ))}

          {loadMedia && (
            <div className="chat_row your_message">
              <img
                src={IconLoad}
                alt="loading"
                className="d-block my-2 chat_row your_message"
                style={{ width: "82px" }}
              />
            </div>
          )}
        </div>
      </div>
      {medias.length > 0 && (
        <div className="show_media">
          {medias.map((item, i) => (
            <div key={i} id="file_media">
              {item.type.match(/video/i)
                ? videoShow(URL.createObjectURL(item), theme)
                : imageShow(URL.createObjectURL(item), theme)}
              <span onClick={() => handelDelete(i)}>&times;</span>
            </div>
          ))}
        </div>
      )}
      <form
        className="chat_input"
        onFocus={() => scrollSmoth(refDisplay.current)}
      >
        <input
          type="text"
          name=""
          id=""
          placeholder="Enter your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            filter: theme ? "invert(1)" : "invert(0)",

            background: theme ? "#474646" : "",
            color: theme ? "#fff" : "",
          }}
        />
        <Emojie content={text} setContent={setText} theme={theme} />
        <div className="file_upload">
          <i className="fas fa-image text-danger nav-item"></i>
          <input
            type="file"
            id="file"
            multiple
            accept="image/*,video/*"
            onChange={handelChange}
          />
        </div>

        <button
          type="submit"
          disabled={text || medias.length !== 0 ? false : true}
          onClick={handelSubmit}
          style={{ paddingLeft: "12px" }}
        >
          <i
            aria-hidden
            className="fas fa-location-arrow nav-item send_button"
            style={{
              fontSize: "19px",
              filter: theme ? "invert(1)" : "invert(0)",
            }}
          ></i>
        </button>
      </form>
      <audio controls ref={audioRef} style={{ display: "none" }}>
        <source src={audioBlip1} type="audio/wav" />
      </audio>
      <audio controls ref={audioDeleteRef} style={{ display: "none" }}>
        <source src={audioBlip2} type="audio/wav" />
      </audio>
    </>
  );
}

RightSlide.propTypes = {
  auth: PropTypes.object,
};

export default RightSlide;
