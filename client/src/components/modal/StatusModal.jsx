import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { statusAction } from "../../redux/actions/global";
import { useState, useRef } from "react";
import { alertAction } from "../../redux/actions/alert";
import { createPost, updatePost } from "../../redux/actions/post";
import { useEffect } from "react";
import Emojie from "../emoji/Emojie";
import { imageShow, videoShow } from "../../utils/mediaShow";

function StatusModal() {
  const { auth, theme, status, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [stream, setStream] = useState(false);
  const [tracks, setTracks] = useState("");
  const videoRef = useRef();
  const refCanvas = useRef();
  const handelChange = (e) => {
    let files = [...e.target.files];
    let err = "";
    let newImages = [];

    files.forEach((file) => {
      if (!file) return (err = "file does not exist.");
      if (file.size > 1024 * 1024 * 5) {
        return (err = "The image/video largest is 5mb.");
      }

      return newImages.push(file);
    });
    if (err) dispatch(alertAction({ error: err }));
    setImages([...images, ...newImages]);
  };
  const handelDeleteImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };
  const handelStream = () => {
    setStream(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
          const track = mediaStream.getTracks();
          setTracks(track[0]);
        })
        .catch((err) => console.log(err));
    }
  };

  const handelCapture = () => {
    const width = videoRef.current.clientWidth;
    const height = videoRef.current.clientHeight;
    refCanvas.current.setAttribute("width", width);
    refCanvas.current.setAttribute("height", height);

    const ctx = refCanvas.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, width, height);
    let URL = refCanvas.current.toDataURL();
    setImages([...images, { camera: URL }]);
  };
  const handelStopStream = () => {
    if (stream) {
      tracks.stop();
      setStream(false);
    }
  };

  const handelSubmit = (e) => {
    e.preventDefault();

    if (images.length === 0 || images.length >= 6) {
      return dispatch(
        alertAction({ error: "Number of files must be between 1 and 5!" })
      );
    }
    if (status.onEdit) {
      dispatch(updatePost({ content, images, auth, status }));
    } else {
      dispatch(createPost({ content, images, auth, socket }));
    }
    setContent("");
    setImages([]);
    if (stream) {
      tracks.stop();
      setStream(false);
    }
    dispatch(statusAction(false));
  };

  useEffect(() => {
    if (status.onEdit) {
      setContent(status.content);
      setImages(status.images);
    }
  }, [status]);

  return (
    <div className="status_modal">
      <div
        className="overlay"
        onClick={() => {
          dispatch(statusAction(false));
          handelStopStream();
        }}
      />
      <div className="status_form">
        <form onSubmit={handelSubmit}>
          <div className="status_header">
            <h5 className="m-0">New Post</h5>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                dispatch(statusAction(false));
                handelStopStream();
              }}
            >
              &times;
            </span>
          </div>
          <div className="status_body ">
            {!stream && (
              <textarea
                name="content"
                style={{
                  filter: theme ? "invert(1)" : "invert(0)",
                  background: theme ? "#32333494" : "",
                  color: theme ? "white" : "",
                  border: theme ? "none" : "none",
                }}
                placeholder={`${auth.user.username}, `}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            )}
            <div className="d-flex">
              <div className="flex-fill"></div>
              <Emojie setContent={setContent} content={content} theme={theme} />
            </div>
            <div className="show_images">
              {images.map((image, i) => (
                <div key={i} id="file_img">
                  {image.camera ? (
                    imageShow(image.camera, theme)
                  ) : image.url ? (
                    <>
                      {image.url.match(/video/i)
                        ? videoShow(image.url, theme)
                        : imageShow(image.url, theme)}
                    </>
                  ) : (
                    <>
                      {image.type.match(/video/i)
                        ? videoShow(URL.createObjectURL(image), theme)
                        : imageShow(URL.createObjectURL(image), theme)}
                    </>
                  )}

                  <span onClick={() => handelDeleteImage(i)}>&times;</span>
                </div>
              ))}
            </div>
            {stream && (
              <div className="stream">
                <video
                  ref={videoRef}
                  width="100%"
                  height="100%"
                  autoPlay
                  muted
                  style={{ filter: theme ? "invert(1)" : "invert(0)" }}
                />
                <i className="fas fa-ban" onClick={handelStopStream}></i>
                <canvas
                  ref={refCanvas}
                  width="100%"
                  style={{ display: "none" }}
                />
              </div>
            )}
            <div className="input_images my-2">
              {stream ? (
                <i className="fas fa-camera" onClick={handelCapture} />
              ) : (
                <>
                  <i className="fas fa-camera" onClick={handelStream} />
                  <div className="file_upload ">
                    <i className="fas fa-image" />
                    <input
                      type="file"
                      name="file"
                      id="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handelChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="status_footer">
            <button type="submit" className="btn btn-outline-info w-100">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

StatusModal.propTypes = {
  auth: PropTypes.object,
};

export default StatusModal;
