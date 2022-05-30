import { getData } from "../../utils/fetchData";
import { discoverTypes } from "../type/types";
import { alertAction } from "./alert";

export const discoverAction = (token) => async (dispatch) => {
  try {
    dispatch({
      type: discoverTypes.DISCOVER_LOADING,
      payload: true,
    });
    const res = await getData("post_discover", token);
    dispatch({
      type: discoverTypes.GET_DISCOVER_POSTS,
      payload: res.data,
    });
    dispatch({
      type: discoverTypes.DISCOVER_LOADING,
      payload: false,
    });
  } catch (error) {
    dispatch(alertAction({ error: error.response.data.msg }));
  }
};
