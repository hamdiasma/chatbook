import { authTypes } from "../type/types";

const initialState = {};

const authReducers = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case authTypes.LOGIN_USER:
    case authTypes.REFRESH_INFO:
    case authTypes.REFRESH_TOKEN:
    case authTypes.REGISTER_USER:
      return payload;

    case authTypes.LOGOUT_USER:
      return payload;
    default:
      return state;
  }
};

export default authReducers;
