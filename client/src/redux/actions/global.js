import { modalTypes, statusType, themeType } from "../type/types";

export const themeAction = (payload) => (dispatch) => {
  dispatch({
    type: themeType.THEME,
    payload: payload,
  });
};

export const statusAction = (payload) => (dispatch) => {
  dispatch({
    type: statusType.STATUS,
    payload,
  });
};

export const modalAction = (payload) => (dispatch) => {
  dispatch({
    type: modalTypes.MODAL,
    payload,
  });
};
