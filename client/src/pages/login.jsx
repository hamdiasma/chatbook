import React, { useEffect, useState } from "react";
import AccountDescription from "../components/accountLink/AccountDescription";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../redux/actions/auth";
import { useHistory } from "react-router-dom";

const Login = () => {
  const initialState = {
    email: "",
    password: "",
  };
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(initialState);
  const { email, password } = userData;
  const [typePass, setTypePass] = useState(false);
  const { auth } = useSelector((state) => state);
  const history = useHistory();

  const handelChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    try {
      dispatch(loginAction(userData));
    } catch (error) {}
  };

  useEffect(() => {
    if (auth.token) {
      history.push("/");
    }
  }, [auth.token, history]);

  return (
    <div className="login_page">
      <div>
        <form autoComplete="nope" onSubmit={handelSubmit}>
          <p className="text-center mb-4">Login page</p>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              onChange={handelChange}
              value={email}
              autoComplete="nope"
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
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
              />
              <small onClick={() => setTypePass(!typePass)}>
                {typePass ? "hide" : "show"}
              </small>
            </div>
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
          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={email && password ? false : true}
          >
            Login
          </button>
          <AccountDescription
            text="I don't have an account ? "
            url="/register"
            urlText="register"
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
