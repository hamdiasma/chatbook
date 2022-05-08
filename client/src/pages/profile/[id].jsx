import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import Info from "../../components/profile/Info";
import Posts from "../../components/profile/Posts";
import { useDispatch, useSelector } from "react-redux";
import LoadingIcon from "../../images/480px-Loader.gif";
import { getProfileAction } from "../../redux/actions/profile";
import Saved from "../../components/profile/Saved";

function Profile() {
  const { profile, auth, theme } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [saveTab, setSaveTab] = useState(false);
  useEffect(() => {
    if (profile.ids.every((item) => item !== id)) {
      dispatch(getProfileAction({ id, auth }));
    }
  }, [auth, dispatch, profile.ids, id]);

  return (
    <div className="profile">
      <Info
        auth={auth}
        profile={profile}
        id={id}
        dispatch={dispatch}
        theme={theme}
      />

      {auth.user._id === id && (
        <div className="saveTab">
          <button
            className={saveTab ? "" : "activeTab"}
            onClick={() => setSaveTab(false)}
          >
            My Posts
          </button>
          <button
            className={saveTab ? "activeTab" : ""}
            onClick={() => setSaveTab(true)}
          >
            Posts Saved
          </button>
        </div>
      )}

      {profile.loading ? (
        <>
          <div className="d-flex justify-content-center mt-5">
            <img src={LoadingIcon} alt="loading" width="150px" />
            <br />
          </div>
          <p className="text-center loading-profile">Loading...!</p>
        </>
      ) : saveTab ? (
        <Saved auth={auth} dispatch={dispatch} theme={theme} />
      ) : (
        <Posts
          auth={auth}
          profile={profile}
          id={id}
          dispatch={dispatch}
          theme={theme}
        />
      )}
    </div>
  );
}

Profile.propTypes = {
  auth: PropTypes.object,
};

export default Profile;
