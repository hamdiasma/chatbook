import { editDataSimple } from "../../utils/utilsFunction";
import { postTypes } from "../type/types";

const detailPostReducers = (state = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case postTypes.GET_POST:
      return [...state, payload];
    case postTypes.EDITE_POST:
      return editDataSimple(state, payload._id, payload);
    default:
      return state;
  }
};

export default detailPostReducers;
