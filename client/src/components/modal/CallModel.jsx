import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../avatar/Avatar";
import { alertTypes, globalTypes } from "../../redux/type/types";
import { stopTracks } from "../../utils/tracks";
import { timer } from "../../utils/timer";
import { addMessageAction } from "../../redux/actions/message";
import audioRingRecip from "../../audio/facebook_call.mp3";

function CallModel() {
  const { call, auth, theme, peer, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [total, setTotal] = useState(0);
  const [answer, setAnswer] = useState(false);
  const [tracks, setTracks] = useState(null);
  const [newCall, setNewcall] = useState(null);
  // const [audio, setAudio] = useState(true);
  const youVideo = useRef();
  const otherVideo = useRef();
  const audeiReRef = useRef();
  // time
  useEffect(() => {
    const setTime = () => {
      setTotal((t) => t + 1);
      setTimeout(setTime, 1000);
    };
    setTime();
    return () => setTotal(0);
  }, []);
  useEffect(() => {
    setSeconds(total % 60);
    setMins(parseInt(total / 60));
    setHours(parseInt(total / 3600));
  }, [total]);

  // end call
  const addCallMsg = useCallback(
    (call, times, disconnect) => {
      if (call.recipient !== auth.user._id || disconnect) {
        const msg = {
          sender: call.sender,
          recipient: call.recipient,
          text: "",
          media: [],
          call: { video: call.video, times },
          createdAt: new Date().toISOString(),
        };
        dispatch(addMessageAction({ msg, auth, socket }));
      }
    },
    [auth, dispatch, socket]
  );
  const handleCloseCall = () => {
    stopTracks(tracks);
    if (newCall) newCall.close();

    let times = answer ? total : 0;
    socket.emit("endCall", { ...call, times });

    addCallMsg(call, times);

    dispatch({
      type: globalTypes.CALL,
      payload: null,
    });
  };
  useEffect(() => {
    if (answer) {
      setTotal(0);
    } else {
      const timer = setTimeout(() => {
        dispatch({
          type: globalTypes.CALL,
          payload: null,
        });
        socket.emit("endCall", { ...call, times: 0 });
        addCallMsg(call, 0);
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [dispatch, answer, call, socket, addCallMsg]);
  useEffect(() => {
    socket.on("endCallToClient", (data) => {
      tracks && stopTracks(tracks);
      if (newCall) newCall.close();
      addCallMsg(data, data.times);
      dispatch({
        type: globalTypes.CALL,
        payload: null,
      });
    });
    return () => socket.off("endCallToClient");
  }, [dispatch, socket, tracks, addCallMsg, newCall]);
  // straem video
  const openStream = (video) => {
    const config = { audio: true, video };
    return navigator.mediaDevices.getUserMedia(config);
  };

  const playStream = (tag, stream) => {
    let video = tag;
    video.srcObject = stream;
    video.play();
  };
  // answer call
  const handleAnsware = () => {
    openStream(call.video).then((stream) => {
      if (youVideo.current) {
        playStream(youVideo.current, stream);
      }

      const track = stream.getTracks();
      setTracks(track);
      const newCall = peer.call(call.peerId, stream);
      newCall.on("stream", function (remoteStream) {
        if (otherVideo.current) {
          playStream(otherVideo.current, remoteStream);
        }
      });

      setAnswer(true);
      setNewcall(newCall);
    });
  };
  useEffect(() => {
    // call.answer(stream); // Answer the call with an A/V stream.
    peer.on("call", (newCall) => {
      openStream(call.video).then((stream) => {
        if (youVideo.current) {
          playStream(youVideo.current, stream);
        }
        const track = stream.getTracks();
        setTracks(track);
        newCall.answer(stream);

        newCall.on("stream", function (remoteStream) {
          if (otherVideo.current) {
            playStream(otherVideo.current, remoteStream);
          }
        });

        setAnswer(true);
        setNewcall(newCall);
      });
    });

    return () => peer.removeListener("call");
  }, [peer, call.video]);
  // disconnecr
  useEffect(() => {
    socket.on("callerDisconnect", () => {
      tracks && stopTracks(tracks);
      if (newCall) newCall.close();
      socket.emit("endCall", call);
      const times = answer ? total : 0;
      addCallMsg(call, times, true);
      dispatch({
        type: globalTypes.CALL,
        payload: null,
      });
      dispatch({
        type: alertTypes.ALERT_MESSAGE,
        payload: {
          error: `${call.fullname + " " + call.username} is disconnect`,
        },
      });
    });
    return () => socket.off("callerDisconnect");
  }, [
    dispatch,
    socket,
    tracks,
    call,
    call.username,
    call.fullname,
    addCallMsg,
    answer,
    total,
    newCall,
  ]);
  // play && pause audio

  const playAudio = (newAudio) => {
    newAudio.play();
  };
  const pauseAudio = (newAudio) => {
    newAudio.pause();
    newAudio.currentTime = 0;
  };
  useEffect(() => {
    let newAudio = new Audio(audioRingRecip);
    if (answer) {
      pauseAudio(newAudio);
    } else {
      playAudio(newAudio);
    }
    return () => pauseAudio(newAudio);
  }, [answer]);

  return (
    <div className="call_model">
      <div
        className="call_box"
        style={{
          display: answer && call.video ? "none" : "flex",
          filter: theme ? "invert(1)" : "invert(0)",
        }}
      >
        <div className="text-center" style={{ padding: "40px" }}>
          <Avatar
            src={call.avatar}
            size="xbig-avatar"
            style={{
              display: answer && call.video ? "none" : "flex",
            }}
          />
          <h4>{call.username}</h4>
          <h6>{call.fullname}</h6>
          {answer ? (
            <div className="timer">{timer(hours, mins, seconds)}</div>
          ) : (
            <div>
              {call.video ? (
                <span>calling video...</span>
              ) : (
                <span>calling audio...</span>
              )}
            </div>
          )}
        </div>
        {!answer && <div className="timer">{timer(hours, mins, seconds)}</div>}
        <div className="call_menu ">
          <i
            className="fas fa-times text-danger"
            onClick={handleCloseCall}
            style={{ opacity: answer && call.video ? 0 : 1 }}
          ></i>
          {/* {audio ? (
            <i
              className="fas fa-microphone pointer"
              onClick={() => setAudio(false)}
              style={{
                filter: theme ? "invert(1)" : "invert(0)",
                color: "#278092",
              }}
            ></i>
          ) : (
            <i
              className="fas fa-microphone-slash pointer"
              onClick={() => setAudio(true)}
              style={{
                filter: theme ? "invert(1)" : "invert(0)",
                color: theme ? "#329c0cd1" : "#329c0cd1",
              }}
            ></i>
          )} */}

          {call.recipient === auth.user._id && !answer && (
            <>
              {call.video ? (
                <i
                  className="fas  fa-video pointer"
                  style={{
                    filter: theme ? "invert(1)" : "invert(0)",
                    color: theme ? "#329c0cd1" : "",
                  }}
                  onClick={handleAnsware}
                ></i>
              ) : (
                <i
                  className="fas fa-phone pointer"
                  style={{
                    filter: theme ? "invert(1)" : "invert(0)",
                    color: theme ? "#329c0cd1" : "#329c0cd1",
                  }}
                  onClick={handleAnsware}
                ></i>
              )}
            </>
          )}
        </div>
      </div>

      <div
        className="show_video"
        style={{
          opacity: answer && call.video ? 1 : 0,
          filter: theme ? "invert(1)" : "invert(0)",
        }}
      >
        <video ref={youVideo} className="your_video" playsInline muted />
        <video ref={otherVideo} className="other_video" playsInline />

        <div className="timer time_video">{timer(hours, mins, seconds)}</div>
        <span className="call_menu">
          <i
            className="fas fa-times text-danger end_call"
            onClick={handleCloseCall}
          ></i>
          {/* {audio ? (
            <i
              className="fas fa-microphone pointer"
              onClick={() => setAudio(false)}
              style={{
                filter: theme ? "invert(1)" : "invert(0)",
                color: "#278092",
              }}
            ></i>
          ) : (
            <i
              className="fas fa-microphone-slash pointer"
              onClick={() => setAudio(true)}
              style={{
                filter: theme ? "invert(1)" : "invert(0)",
                color: "#278092",
              }}
            ></i>
          )} */}
        </span>
      </div>
      <audio controls ref={audeiReRef} style={{ display: "none" }}>
        <source
          src={
            call.recipient === auth.user._id ? audioRingRecip : audioRingRecip
          }
          type="audio/wav"
        />
      </audio>
    </div>
  );
}

CallModel.propTypes = {
  auth: PropTypes.object,
};

export default CallModel;
