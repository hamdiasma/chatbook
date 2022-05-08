import { modalTypes } from "../type/types";

const initialState = false;

const modalReducers = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case modalTypes.MODAL:
      return payload;
    default:
      return state;
  }
};

export default modalReducers;
