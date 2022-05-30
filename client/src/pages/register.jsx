import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AccountDescription from "../components/accountLink/AccountDescription";
import { registerAction } from "../redux/actions/auth";

const Register = () => {
  const initialState = {
    fullname: "",
    username: "",
    email: "",
    password: "",
    cf_password: "",
    gender: "male",
  };

  const [userData, setUserData] = useState(initialState);
  const [typePass, setTypePass] = useState(false);
  const [typeCPass, setTypeCPass] = useState(false);
  const { auth, alert } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const { fullname, username, email, password, cf_password } = userData;

  const handelChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    try {
      dispatch(registerAction(userData));
    } catch (error) {}
  };
  // console.log({ alert });

  useEffect(() => {
    if (auth.token) history.push("/");
  }, [auth.token, history]);
  return (
    <div className="login_page">
      <div>
        <form autoComplete="nope" onSubmit={handelSubmit}>
          <p className="text-center mb-4">Register page</p>
          <div className="mb-3">
            <label htmlFor="fullname" className="form-label">
              Full name
            </label>
            <input
              type="text"
              name="fullname"
              className="form-control"
              id="fullname"
              onChange={handelChange}
              value={fullname}
              autoComplete="nope"
              style={{ background: `${alert.fullname ? "#fd2d6a14" : ""}` }}
            />
            <small className="form-text text-danger">
              {alert.fullname && alert.fullname}
            </small>
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              User name
            </label>
            <input
              type="text"
              name="username"
              className="form-control"
              id="username"
              onChange={handelChange}
              value={username.toLowerCase().replace(/ /g, "")}
              autoComplete="nope"
              style={{ background: `${alert.username ? "#fd2d6a14" : ""}` }}
            />
            <small className="form-text text-danger">
              {alert.username && alert.username}
            </small>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="text"
              name="email"
              className="form-control"
              id="exampleInputEmail1"
              onChange={handelChange}
              value={email}
              autoComplete="nope"
              style={{ background: `${alert.email ? "#fd2d6a14" : ""}` }}
            />
            <small className="form-text text-danger">
              {alert.email && alert.email}
            </small>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <div className="pass">
              <input
                type={typePass ? "text" : "password"}
                name="password"
                className="form-control"
                id="exampleInputPassword1"
                autoComplete="password"
                onChange={handelChange}
                value={password}
                style={{ background: `${alert.password ? "#fd2d6a14" : ""}` }}
              />
              <small onClick={() => setTypePass(!typePass)}>
                {typePass ? "hide" : "show"}
              </small>
            </div>
            <small className="form-text text-danger">
              {alert.password && alert.password}
            </small>
          </div>
          <div className="mb-3">
            <label htmlFor="cf_password" className="form-label">
              Confirm Password
            </label>
            <div className="pass">
              <input
                type={typeCPass ? "text" : "password"}
                name="cf_password"
                className="form-control"
                id="cf_password"
                autoComplete="password"
                onChange={handelChange}
                value={cf_password}
                style={{
                  background: `${alert.cf_password ? "#fd2d6a14" : ""}`,
                }}
              />
              <small onClick={() => setTypeCPass(!typeCPass)}>
                {typeCPass ? "hide" : "show"}
              </small>
            </div>
            <small className="form-text text-danger">
              {alert.cf_password && alert.cf_password}
            </small>
          </div>
          <div className="d-flex justify-content-between mb-3 mx-0">
            <label htmlFor="male">
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                defaultChecked
                onChange={handelChange}
              />{" "}
              Male
            </label>
            <label htmlFor="female">
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                onChange={handelChange}
              />{" "}
              Female
            </label>
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
            />
            <label className="form-check-label" htmlFor="exampleCheck1">
              Check me out
            </label>
          </div>
          <button type="submit" className="btn btn-dark w-100">
            Register
          </button>
          <AccountDescription
            text="I already have an account ? "
            url="/login"
            urlText="sign in"
          />
        </form>
      </div>
    </div>
  );
};

Register.propTypes = {
  auth: PropTypes.object,
  alert: PropTypes.object,
};

export default Register;
