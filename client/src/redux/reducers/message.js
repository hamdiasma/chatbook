import { deleteDataSimple, editDataSimple } from "../../utils/utilsFunction";
import { messageTypes } from "../type/types";

const initialState = {
  users: [],
  data: [],
  resultUsers: 0,
  firstLoad: false,
};

const messageReducers = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case messageTypes.ADD_USER:
      if (state.users.every((item) => item._id !== payload._id)) {
        return {
          ...state,
          users: [payload, ...state.users],
        };
      }
      return state;

    case messageTypes.ADD_MESSAGE:
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === payload.recipient || item._id === payload.sender
            ? {
                ...item,
                messages: [...item.messages, payload],
                result: item.result + 1,
              }
            : item
        ),
        users: state.users.map((user) =>
          user._id === payload.recipient || user._id === payload.sender
            ? {
                ...user,
                text: payload.text,
                media: payload.media,

                call: payload.call,
              }
            : user
        ),
      };
    case messageTypes.GET_CONVERSATIONS:
      return {
        ...state,
        users: payload.newArr,
        resultUsers: payload.result,
        firstLoad: true,
      };

    case messageTypes.GET_MESSAGES:
      return {
        ...state,
        data: [...state.data, payload],
      };

    case messageTypes.UPDATED_GET_MESSAGES:
      return {
        ...state,
        data: editDataSimple(state.data, payload._id, payload),
      };
    case messageTypes.DELETE_MESSAGE:
      return {
        ...state,
        data: state.data.map((item) =>
          item._id === payload._id
            ? {
                ...item,
                messages: payload.newData,
              }
            : item
        ),
      };
    case messageTypes.DELETE_CONVERSATION:
      return {
        ...state,
        users: deleteDataSimple(state.users, payload),
        data: deleteDataSimple(state.data, payload),
      };
    case messageTypes.CHECK_ONLINE_OFFLINE:
      return {
        ...state,
        users: state.users.map((user) =>
          payload.includes(user._id)
            ? { ...user, online: true }
            : { ...user, online: false }
        ),
      };

    default:
      return state;
  }
};

export default messageReducers;
