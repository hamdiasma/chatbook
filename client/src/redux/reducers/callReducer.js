import { globalTypes } from "../type/types";

const callReducers = (state = null, action) => {
  const { type, payload } = action;
  switch (type) {
    case globalTypes.CALL:
      return payload;
    default:
      return state;
  }
};

export default callReducers;
