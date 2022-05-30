import { authTypes, alertTypes } from "../type/types";
import { postData } from "../../utils/fetchData";
import { alertAction } from "./alert";
import { validation } from "../../utils/validations";

export const loginAction = (data) => async (dispatch) => {
  try {
    dispatch(alertAction({ loading: true }));
    const res = await postData("login", data);

    dispatch({
      type: authTypes.LOGIN_USER,
      payload: {
        token: res.data.access_token,
        user: res.data.user,
      },
    });

    localStorage.setItem("socialLogged", true);
    dispatch(alertAction({ success: res.data.msg }));
  } catch (error) {
    dispatch(alertAction({ error: error.response.data.msg }));
  }
};

export const refreshTokenAction = () => async (dispatch) => {
  let socialLogged = localStorage.getItem("socialLogged");

  try {
    if (socialLogged) {
      dispatch(alertAction({ loading: true }));
      const res = await postData("refresh_token", null, null);
      dispatch({
        type: authTypes.REFRESH_TOKEN,
        payload: {
          token: res.data.access_token,
          user: res.data.user,
        },
      });
      dispatch(alertAction({ loading: false }));
    }
  } catch (error) {
    dispatch(alertAction({ error: error.response.data.msg }));
  }
};

export const registerAction = (data) => async (dispatch) => {
  let check = validation(data);
  if (check.errLength > 0) {
    return dispatch({
      type: alertTypes.NOTIFY,
      payload: check.errMsg,
    });
  }
  try {
    dispatch(alertAction({ loading: true }));
    const res = await postData("register", data);

    dispatch({
      type: authTypes.REGISTER_USER,
      payload: {
        token: res.data.access_token,
        user: res.data.user,
      },
    });

    localStorage.setItem("socialLogged", true);
    dispatch(alertAction({ success: res.data.msg }));
  } catch (error) {
    dispatch(alertAction({ error: error.response.data.msg }));
  }
};

export const logOutAction = () => async (dispatch) => {
  try {
    const res = await postData("logout");
    dispatch({
      type: authTypes.LOGOUT_USER,
      payload: {},
    });
    localStorage.removeItem("socialLogged");
    dispatch(alertAction({ success: res.data.msg }));
  } catch (error) {
    dispatch(alertAction({ error: error.response.data.msg }));
  }
};
