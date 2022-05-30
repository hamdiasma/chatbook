import { getData } from "../../utils/fetchData";
import { seggestionsTypes } from "../type/types";
import { alertAction } from "./alert";

export const getSuggestionsActions = (token) => async (dispatch) => {
  try {
    dispatch({
      type: seggestionsTypes.LOADING_SUGGESTIONS,
      payload: true,
    });

    const res = await getData("suggestions-user", token);
    dispatch({
      type: seggestionsTypes.GET_USERS_SUGGESTIONS,
      payload: res.data,
    });
    dispatch({
      type: seggestionsTypes.LOADING_SUGGESTIONS,
      payload: false,
    });
  } catch (error) {
    dispatch(alertAction({ error: error.response.data.msg }));
  }
};
