import { globalTypes } from "../type/types";

const socketRouter = (state = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case globalTypes.SOCKET:
      return payload;
    default:
      return state;
  }
};

export default socketRouter;
