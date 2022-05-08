import { getData, patchData } from "../../utils/fetchData";
import { imageUploade } from "../../utils/imageUpload";
import { deleteDataSimple } from "../../utils/utilsFunction";
import { alertAction } from "./alert";
import { removeNotifyAction, createNotifyAction } from "./notify";

const { profileTypes, authTypes } = require("../type/types");

export const getProfileAction =
  ({ id, auth }) =>
  async (dispatch) => {
    dispatch({
      type: profileTypes.GET_ID,
      payload: id,
    });
    try {
      dispatch({
        type: profileTypes.LOADING,
        payload: true,
      });
      const res = getData(`users/${id}`, auth.token);
      const res1 = getData(`user_posts/${id}`, auth.token);
      const users = await res;
      const posts = await res1;
      dispatch({
        type: profileTypes.GET_PROFILE,
        payload: users.data,
      });
      dispatch({
        type: profileTypes.GET_USER_POSTS,
        payload: {
          ...posts.data,
          _id: id,
          page: 2,
        },
      });
      dispatch({
        type: profileTypes.LOADING,
        payload: false,
      });
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const updateProfileAction =
  (formdata, avatar, auth) => async (dispatch) => {
    if (!formdata.fullname)
      return dispatch(alertAction({ error: "Fullname is required" }));
    if (formdata.fullname.length > 25)
      return dispatch(
        alertAction({ error: "Fullname must be less then 25 catachters" })
      );
    if (formdata.story.length > 200)
      return dispatch(
        alertAction({ error: "story must be less then 200 catachters" })
      );
    try {
      dispatch(alertAction({ loading: true }));
      let media;
      if (avatar) media = await imageUploade([avatar]);
      const res = await patchData(
        "user",
        {
          ...formdata,
          avatar: avatar ? media[0].url : auth.user.avatar,
        },
        auth.token
      );
      dispatch({
        type: authTypes.REFRESH_INFO,
        payload: {
          ...auth,
          user: {
            ...auth.user,
            ...formdata,
            avatar: avatar ? media[0].url : auth.user.avatar,
          },
        },
      });

      dispatch(alertAction({ success: res.data.msg }));
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const followAction =
  ({ users, auth, user, socket }) =>
  async (dispatch) => {
    // if usernot exist from users
    let newUser;
    if (users.every((item) => item._id !== user._id)) {
      newUser = { ...user, followers: [...user.followers, auth.user] };
    } else {
      users.forEach((item) => {
        if (item._id === user._id) {
          newUser = { ...item, followers: [...item.followers, auth.user] };
        }
      });
    }

    // let newUser = { ...user, followers: [...user.followers, auth.user] };
    dispatch({
      type: profileTypes.FOLLOW,
      payload: newUser,
    });
    dispatch({
      type: authTypes.REFRESH_INFO,
      payload: {
        ...auth,
        user: {
          ...auth.user,
          following: [...auth.user.following, newUser],
        },
      },
    });

    try {
      const res = await patchData(`user/${user._id}/follow`, null, auth.token);
      socket.emit("follow", res.data.newUser);
      // notify

      const msg = {
        id: auth.user._id,
        text: "has started to follow you",
        recipients: [newUser._id],
        url: `/profile/${auth.user._id}`,
      };

      dispatch(createNotifyAction({ msg, auth, socket }));
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const unFollowAction =
  ({ users, auth, user, socket }) =>
  async (dispatch) => {
    let newUser;
    if (users.every((item) => item._id !== user._id)) {
      newUser = {
        ...user,
        followers: deleteDataSimple(user.followers, auth.user._id),
      };
    } else {
      users.forEach((item) => {
        if (item._id === user._id) {
          newUser = {
            ...item,
            followers: deleteDataSimple(item.followers, auth.user._id),
          };
        }
      });
    }

    dispatch({
      type: profileTypes.UNFOLLOW,
      payload: newUser,
    });
    dispatch({
      type: authTypes.REFRESH_INFO,
      payload: {
        ...auth,
        user: {
          ...auth.user,
          following: deleteDataSimple(auth.user.following, newUser._id),
        },
      },
    });

    try {
      const res = await patchData(
        `user/${user._id}/unfollow`,
        null,
        auth.token
      );
      socket.emit("unFollow", res.data.newUser);

      const msg = {
        id: auth.user._id,
        text: "has started to follow you",
        recipients: [newUser._id],
        url: `/profile/${auth.user._id}`,
      };

      dispatch(removeNotifyAction({ msg, auth, socket }));
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };
