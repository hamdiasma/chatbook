import { discoverTypes } from "../type/types";

const initialState = {
  loading: false,
  posts: [],
  result: 9,
  page: 2,
  firstLoad: false,
};

const discoverReducers = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case discoverTypes.DISCOVER_LOADING:
      return {
        ...state,
        loading: payload,
      };
    case discoverTypes.GET_DISCOVER_POSTS:
      return {
        ...state,
        posts: payload.posts,
        result: payload.result,
        firstLoad: true,
      };
    case discoverTypes.UPDATE_DISCOVER_POSTS:
      return {
        ...state,
        posts: payload.posts,
        result: payload.result,
        page: state.page + 1,
      };
    default:
      return state;
  }
};

export default discoverReducers;
