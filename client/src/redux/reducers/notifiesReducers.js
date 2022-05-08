import { editDataSimple } from "../../utils/utilsFunction";
import { notifyTypes } from "../type/types";

const initialState = {
  loading: false,
  data: [],
  sound: true,
};

const notifiesReducers = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case notifyTypes.GET_NOTIFIS:
      return {
        ...state,
        data: payload,
      };
    case notifyTypes.CREATE_NOTIFY:
      return {
        ...state,
        data: [payload, ...state.data],
      };
    case notifyTypes.REMOVE_NOTIFY:
      return {
        ...state,
        data: state.data.filter(
          (item) => item.id !== payload.id || item.url !== payload.url
        ),
      };
    case notifyTypes.UPDATE_NOTIFy:
      return {
        ...state,
        data: editDataSimple(state.data, payload._id, payload),
      };
    case notifyTypes.UPDATE_SOUND:
      return {
        ...state,
        sound: payload,
      };
    case notifyTypes.DELETE_ALL_NOTIFies:
      return {
        ...state,
        data: [],
      };
    default:
      return state;
  }
};

export default notifiesReducers;
