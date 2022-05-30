import { alertTypes } from "../type/types";

const initialState = {};

const alertReducers = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case alertTypes.ALERT_MESSAGE:
      return payload;
    default:
      return state;
  }
};

export default alertReducers;
