import { editDataSimple } from "../../utils/utilsFunction";
import { profileTypes } from "../type/types";

const initialState = {
  ids: [],
  users: [],
  user: [],
  posts: [],
};

const profileReducers = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case profileTypes.LOADING:
      // console.log(payload);
      return {
        ...state,
        loading: payload,
      };
    case profileTypes.GET_PROFILE:
      return {
        ...state,
        users: [...state.users, payload.user],
      };
    case profileTypes.FOLLOW:
      return {
        ...state,
        users: editDataSimple(state.users, payload._id, payload),
      };
    case profileTypes.UNFOLLOW:
      return {
        ...state,
        users: editDataSimple(state.users, payload._id, payload),
      };
    case profileTypes.GET_ID:
      return {
        ...state,
        ids: [...state.ids, payload],
      };
    case profileTypes.GET_USER_POSTS:
      return {
        ...state,
        posts: [...state.posts, payload],
      };
    case profileTypes.UPDATE_PROFILE_POST:
      return {
        ...state,
        posts: editDataSimple(state.posts, payload._id, payload),
      };
    default:
      return state;
  }
};

export default profileReducers;
