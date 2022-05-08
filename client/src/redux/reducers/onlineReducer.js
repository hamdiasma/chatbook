import { globalTypes } from "../type/types";

const onlineReducers = (state = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case globalTypes.ONLINE:
      return [...state, payload];
    case globalTypes.OFFLINE:
      return state.filter((item) => item !== payload);
    default:
      return state;
  }
};

export default onlineReducers;
