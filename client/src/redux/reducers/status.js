import { statusType } from "../type/types";

const initialState = false;

const statusReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case statusType.STATUS:
      return payload;
    default:
      return state;
  }
};

export default statusReducer;
