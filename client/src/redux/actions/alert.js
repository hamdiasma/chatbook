import { alertTypes } from "../type/types";

export const alertAction = (payload) => (dispatch) => {
  dispatch({
    type: alertTypes.ALERT_MESSAGE,
    payload,
  });
};
