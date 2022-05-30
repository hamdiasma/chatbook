import { deleteData, getData, postData } from "../../utils/fetchData";
import { deleteDataSimple } from "../../utils/utilsFunction";
import { messageTypes } from "../type/types";
import { alertAction } from "./alert";

export const addMessageAction =
  ({ msg, auth, socket }) =>
  async (dispatch) => {
    dispatch({
      type: messageTypes.ADD_MESSAGE,
      payload: msg,
    });
    const { _id, avatar, fullname, username } = auth.user;
    const data = { ...msg, user: { _id, avatar, fullname, username } };
    socket.emit("addMessage", data);

    try {
      await postData("message", msg, auth.token);
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };
export const getConversationAction =
  ({ auth, page = 1 }) =>
  async (dispatch) => {
    try {
      const res = await getData(`conversations?limit=${page * 9}`, auth.token);
      let newArr = [];
      res.data.conversaions.forEach((item) => {
        item.recipients.forEach((cv) => {
          if (cv._id !== auth.user._id) {
            newArr.push({
              ...cv,
              text: item.text,
              media: item.media,
              call: item.call,
            });
          }
        });
      });

      dispatch({
        type: messageTypes.GET_CONVERSATIONS,
        payload: { newArr, resull: res.data.result },
      });
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const getMessagesAction =
  ({ auth, id, page = 1 }) =>
  async (dispatch) => {
    try {
      const res = await getData(`messages/${id}?limit=${page * 9}`, auth.token);
      const newData = {
        ...res.data,
        messages: res.data.messages.reverse(),
      };

      dispatch({
        type: messageTypes.GET_MESSAGES,
        payload: { ...newData, _id: id, page },
      });
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const loadMoreMessagesAction =
  ({ auth, id, page = 1 }) =>
  async (dispatch) => {
    try {
      const res = await getData(`messages/${id}?limit=${page * 9}`, auth.token);
      const newData = {
        ...res.data,
        messages: res.data.messages.reverse(),
      };

      dispatch({
        type: messageTypes.UPDATED_GET_MESSAGES,
        payload: { ...newData, _id: id, page },
      });
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const deleteMessageAction =
  ({ data, msg, auth }) =>
  async (dispatch) => {
    const newData = deleteDataSimple(data, msg._id);
    dispatch({
      type: messageTypes.DELETE_MESSAGE,
      payload: { newData, _id: msg.recipient },
    });
    try {
      await deleteData(`message/${msg._id}`, auth.token);
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const deleteConversationAction =
  ({ id, auth }) =>
  async (dispatch) => {
    dispatch({
      type: messageTypes.DELETE_CONVERSATION,
      payload: id,
    });
    try {
      await deleteData(`/conversation/${id}`, auth.token);
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };
