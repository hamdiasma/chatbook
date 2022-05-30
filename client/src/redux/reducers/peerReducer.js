import { globalTypes } from "../type/types";

const peerReducer = (state = null, action) => {
  const { type, payload } = action;
  switch (type) {
    case globalTypes.PEER:
      return payload;
    default:
      return state;
  }
};

export default peerReducer;
