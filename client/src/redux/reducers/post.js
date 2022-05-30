import { deleteDataSimple, editDataSimple } from "../../utils/utilsFunction";
import { postTypes } from "../type/types";

const initialState = {
  posts: [],
  result: 9,
  page: 2,
  loading: true,
};

const postReducers = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case postTypes.CREATE_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
      };
    case postTypes.LOADING_POST:
      return {
        ...state,
        loading: payload,
      };
    case postTypes.GET_POSTS:
      return {
        ...state,
        posts: payload.posts,
        result: payload.result,
        page: payload.page,
      };
    case postTypes.EDITE_POST:
      return {
        ...state,
        posts: editDataSimple(state.posts, payload._id, payload),
      };
    case postTypes.DELETE_POST:
      return {
        ...state,
        posts: deleteDataSimple(state.posts, payload._id),
      };
    default:
      return state;
  }
};

export default postReducers;
