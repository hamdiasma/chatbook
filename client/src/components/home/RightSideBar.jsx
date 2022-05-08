import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "../card/UserCard";
import { getSuggestionsActions } from "../../redux/actions/seggestions";
import loadIcon from "../../images/480px-Loader.gif";
import Followbtn from "../btn/FollowBtn";
function RightSideBar(props) {
  const { auth, seggestions } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <div className="my-2">
      <div className="card border-light mb-3">
        <div className="card-header">
          <UserCard user={auth.user} />

          <div className="d-flex justify-content-between align-items-center m-2">
            <h6 className="text-blue mb-0">Suggestions</h6>
            {seggestions.loading ? (
              <div className="spinner-border text-secondary" role="status">
                <span style={{ color: "#6c757d" }} className="visually-hidden">
                  Loading...
                </span>
              </div>
            ) : (
              <i
                className="fas fa-redo"
                style={{
                  cursor: "pointer",
                  color: "#6c757d",
                  fontSize: "12px",
                }}
                onClick={() => dispatch(getSuggestionsActions(auth.token))}
              />
            )}
          </div>
        </div>

        <div
          className="card-body p-0"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {seggestions.loading ? (
            <img
              src={loadIcon}
              alt="load"
              width={100}
              className="d-block mx-auto"
            />
          ) : (
            <div className="seggestions">
              {seggestions.users.map((user) => (
                <UserCard key={user._id} user={user}>
                  <Followbtn user={user} />
                </UserCard>
              ))}
            </div>
          )}
        </div>
        <div className="card-footer text-muted">
          <div style={{ fontSize: "14px" }}>
            <span>
              {" "}
              <a
                href="mailTo:hamdi.babdelhafidh@gmail.com"
                style={{
                  color: "#6c757d",
                  wordBreak: "break-all",
                }}
              >
                {" "}
                <i className="fas fa-envelope" style={{ color: "#e51244" }}></i>
              </a>{" "}
              Hamdi.babdelhafidh@gmail.com
            </span>{" "}
          </div>
          <div>
            <span>
              <i className="fas fa-phone-alt" style={{ color: "#58b4e3" }}></i>{" "}
              (+216) 23619196
            </span>{" "}
          </div>
          <div>
            <span>
              <i
                className="fas fa-address-book"
                style={{ color: "#186f9b" }}
              ></i>{" "}
              <a
                href="https://portfolio-dev-hamdi.herokuapp.com/"
                style={{ color: "#6c757d" }}
              >
                Portfolio
              </a>
            </span>{" "}
          </div>
          <div>
            <small style={{ fontSize: "14px" }}>&copy; HAMDI-BA 2022</small>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

RightSideBar.propTypes = {
  auth: PropTypes.object,
};

export default RightSideBar;
