import { seggestionsTypes } from "../type/types";

const initialState = {
  loading: false,
  users: [],
};

const seggestionsReducers = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case seggestionsTypes.LOADING_SUGGESTIONS:
      return {
        ...state,
        loading: payload,
      };
    case seggestionsTypes.GET_USERS_SUGGESTIONS:
      return {
        ...state,
        users: payload.users,
      };
    default:
      return state;
  }
};

export default seggestionsReducers;
