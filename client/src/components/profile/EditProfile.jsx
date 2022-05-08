import React from "react";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { chekImage } from "../../utils/imageUpload";
import { alertAction } from "../../redux/actions/alert";
import { updateProfileAction } from "../../redux/actions/profile";

function EditProfile({ theme, auth, handelClose }) {
  const dispatch = useDispatch();
  const initialState = {
    fullname: "",
    gender: "",
    mobile: "",
    adress: "",
    story: "",
    website: "",
  };
  const [userData, setUserData] = useState(initialState);
  const [avatar, setAvatar] = useState("");
  const { fullname, mobile, adress, story, website, gender } = userData;
  useEffect(() => {
    setUserData(auth.user);
  }, [auth.user]);

  const handelChangeAvatar = (e) => {
    const file = e.target.files[0];
    const err = chekImage(file);
    if (err) {
      return dispatch(alertAction({ error: err }));
    }
    setAvatar(file);
  };
  const handelChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const handelSubmit = (e) => {
    e.preventDefault();

    dispatch(updateProfileAction(userData, avatar, auth));
    handelClose();
  };

  return (
    <div className="edit_user">
      {/* <div className="overlay" onClick={handelClose} /> */}

      <form onSubmit={handelSubmit}>
        <button
          type="close"
          className="btn btn-danger ml-3 text-light close"
          style={{ filter: theme ? "invert(1)" : "invert(0)" }}
          onClick={handelClose}
        >
          <small>close</small>
        </button>
        <div className="info_avatar mb-3">
          <img
            src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
            alt="avatar"
            style={{ filter: theme ? "invert(1)" : "invert(0)" }}
          />
          <span>
            <i className="fas fa-camera" />
            <p>
              <small>Change</small>
            </p>
            <input
              type="file"
              name=""
              id="file_up"
              accept="image/*"
              onChange={handelChangeAvatar}
            />
          </span>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="fullname">fullname</label>
          <div className="position-relative">
            <input
              name="fullname"
              type="text"
              className="form-control"
              id="fullname"
              aria-describedby="fullname"
              placeholder="Enter fullname"
              value={fullname}
              onChange={handelChangeInput}
            />
            <span
              className="couter_fullname  text-danger"
              style={{
                position: "absolute",
                top: "50%",
                right: "3px",
                transform: "translateY(-50%)",
                fontSize: "12px",
              }}
            >
              {fullname.length}/25
            </span>
          </div>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="mobile">Mobile</label>
          <input
            name="mobile"
            type="text"
            className="form-control"
            id="mobile"
            aria-describedby="mobile"
            placeholder="Enter mobile"
            value={mobile}
            onChange={handelChangeInput}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="adress">Adress</label>
          <input
            name="adress"
            type="text"
            className="form-control"
            id="adress"
            aria-describedby="adress"
            placeholder="Enter adress"
            value={adress}
            onChange={handelChangeInput}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="website">Website</label>
          <input
            name="website"
            type="text"
            className="form-control"
            id="website"
            aria-describedby="website"
            placeholder="Enter website"
            value={website}
            onChange={handelChangeInput}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="story">Story</label>
          <div className="">
            <textarea
              cols={3}
              rows={10}
              name="story"
              type="text"
              className="form-control"
              id="story"
              aria-describedby="story"
              placeholder="Enter story"
              value={story}
              onChange={handelChangeInput}
            />{" "}
            <small
              className="couter_fullname text-danger d-block text-right"
              style={{ fontSize: "12px" }}
            >
              {story.length}/200
            </small>
          </div>
        </div>
        <div className="d-flex  mb-3 mx-0">
          <label htmlFor="male" style={{ marginRight: "10px" }}>
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              checked={gender === "male" ? true : false}
              onChange={handelChangeInput}
            />{" "}
            <small>
              <i>Male</i>{" "}
            </small>
          </label>
          <label htmlFor="female">
            <input
              type="radio"
              id="female"
              name="gender"
              value="female"
              checked={gender === "female" ? true : false}
              onChange={handelChangeInput}
            />{" "}
            <small>
              <i>Female</i>{" "}
            </small>
          </label>
        </div>
        <div className="text-right">
          <button
            type="reset"
            className="btn btn-danger ml-3 text-light"
            style={{ width: "80px", filter: theme ? "invert(1)" : "invert(0)" }}
            onClick={handelClose}
          >
            close
          </button>
          <button
            type="submit"
            className="btn btn-info text-light"
            style={{
              width: "80px",
              marginLeft: "5px",
              filter: theme ? "invert(1)" : "invert(0)",
            }}
          >
            save
          </button>
        </div>
      </form>
    </div>
  );
}

EditProfile.propTypes = {
  theme: PropTypes.bool,
  auth: PropTypes.object,
  handelClose: PropTypes.func,
};

export default EditProfile;
