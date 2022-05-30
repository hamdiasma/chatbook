import {
  deleteData,
  getData,
  patchData,
  postData,
} from "../../utils/fetchData";
import { notifyTypes } from "../type/types";
import { alertAction } from "./alert";

export const createNotifyAction =
  ({ msg, auth, socket }) =>
  async (dispatch) => {
    try {
      const res = await postData("create_notify", msg, auth.token);
      socket.emit("creaNotify", {
        ...res.data.newNotify,
        user: {
          username: auth.user.username,
          avatar: auth.user.avatar,
        },
      });
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const removeNotifyAction =
  ({ msg, auth, socket }) =>
  async (dispatch) => {
    try {
      await deleteData(`delete_notify/${msg.id}?url=${msg.url}`, auth.token);
      socket.emit("removeNotify", msg);
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const getNotifiesAction = (token) => async (dispatch) => {
  try {
    const res = await getData("notifies", token);
    dispatch({
      type: notifyTypes.GET_NOTIFIS,
      payload: res.data.notifies,
    });
  } catch (error) {
    dispatch(alertAction({ error: error.response.data.msg }));
  }
};

export const isReadtNotifyAction =
  ({ msg, auth }) =>
  async (dispatch) => {
    dispatch({
      type: notifyTypes.UPDATE_NOTIFy,
      payload: { ...msg, isRead: true },
    });
    try {
      await patchData(`isread_notify/${msg._id}`, null, auth.token);
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const deletAllNotifies = (token) => async (dispatch) => {
  dispatch({
    type: notifyTypes.DELETE_ALL_NOTIFies,
  });
  try {
    await deleteData("delate_all_notifies", token);
  } catch (error) {
    dispatch(alertAction({ error: error.response.data.msg }));
  }
};

export const updateSoundAction = (payload) => (dispatch) => {
  dispatch({
    type: notifyTypes.UPDATE_SOUND,
    payload,
  });
};
