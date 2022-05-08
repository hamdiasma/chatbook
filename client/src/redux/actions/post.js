import {
  getData,
  postData,
  patchData,
  deleteData,
} from "../../utils/fetchData";
import { imageUploade } from "../../utils/imageUpload";
import { deleteDataSimple } from "../../utils/utilsFunction";
import { authTypes, postTypes } from "../type/types";
import { alertAction } from "./alert";
import { createNotifyAction, removeNotifyAction } from "./notify";

export const createPost =
  ({ content, images, auth, socket }) =>
  async (dispatch) => {
    try {
      let media = [];
      dispatch(alertAction({ loading: true }));
      if (images.length > 0) media = await imageUploade(images);

      const res = await postData(
        "posts",
        { content, images: media },
        auth.token
      );
      dispatch({
        type: postTypes.CREATE_POST,
        payload: { ...res.data.newPost, user: auth.user },
      });
      dispatch(alertAction({ success: res.data.msg }));

      // Notify

      const msg = {
        id: res.data.newPost._id,
        text: "added new post",
        content,
        image: media[0].url,
        recipients: res.data.newPost.user.followers,
        url: `/post/${res.data.newPost._id}`,
      };

      dispatch(createNotifyAction({ msg, auth, socket }));
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const updatePost =
  ({ content, images, auth, status }) =>
  async (dispatch) => {
    let media = [];
    const newImageUrl = images.filter((img) => !img.url);
    const oldImageUrl = images.filter((img) => img.url);
    if (
      status.content === content &&
      newImageUrl.length === 0 &&
      oldImageUrl.length === status.images
    ) {
      return;
    }
    try {
      dispatch(alertAction({ loading: true }));
      if (newImageUrl.length > 0) media = await imageUploade(newImageUrl);
      const res = await patchData(
        `posts/${status._id}`,
        { content, images: [...oldImageUrl, ...media] },
        auth.token
      );
      dispatch({
        type: postTypes.EDITE_POST,
        payload: res.data.newPost,
      });
      dispatch(alertAction({ success: res.data.msg }));
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };
export const getPostsActions = (token) => async (dispatch) => {
  dispatch({
    type: postTypes.LOADING_POST,
    payload: true,
  });

  const res = await getData("posts", token);
  dispatch({
    type: postTypes.GET_POSTS,
    payload: { ...res.data, page: 2 },
  });
  dispatch({
    type: postTypes.LOADING_POST,
    payload: false,
  });

  try {
  } catch (error) {
    dispatch(alertAction({ error: error.response.data.msg }));
  }
};

export const likePostAction =
  ({ post, auth, socket }) =>
  async (dispatch) => {
    const newPost = { ...post, likes: [...post.likes, auth.user] };
    socket.emit("likePost", newPost);

    dispatch({
      type: postTypes.EDITE_POST,
      payload: newPost,
    });
    try {
      await patchData(`posts/${post._id}/like`, null, auth.token);

      const msg = {
        id: auth.user._id,
        text: "like your post",
        recipients: [post.user._id],
        url: `/post/${post._id}`,
        content: post.content,
        image: post.images[0].url,
      };

      dispatch(createNotifyAction({ msg, auth, socket }));
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const unLikePostAction =
  ({ post, auth, socket }) =>
  async (dispatch) => {
    const newPost = {
      ...post,
      likes: deleteDataSimple(post.likes, auth.user._id),
    };

    socket.emit("unLikePost", newPost);
    dispatch({
      type: postTypes.EDITE_POST,
      payload: newPost,
    });
    try {
      await patchData(`posts/${post._id}/unlike`, null, auth.token);
      const msg = {
        id: auth.user._id,
        text: "Unlike your post",
        recipients: [post.user._id],
        url: `/post/${post._id}`,
      };

      dispatch(removeNotifyAction({ msg, auth, socket }));
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const getPost =
  ({ detailPost, id, auth }) =>
  async (dispatch) => {
    if (detailPost.every((post) => post._id !== id)) {
      try {
        const res = await getData(`post/${id}`, auth.token);
        dispatch({
          type: postTypes.GET_POST,
          payload: res.data.post,
        });
      } catch (error) {
        dispatch(alertAction({ error: error.response.data.msg }));
      }
    }
  };

export const deletePostAction =
  ({ post, auth, socket }) =>
  async (dispatch) => {
    dispatch({
      type: postTypes.DELETE_POST,
      payload: post,
    });
    try {
      const res = await deleteData(`post/${post._id}`, auth.token);
      // Notify

      const msg = {
        id: post._id,
        text: "deleted post",
        recipients: res.data.newPost.user.followers,
        url: `/post/${post._id}`,
      };

      dispatch(removeNotifyAction({ msg, auth, socket }));
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const savePostAction =
  ({ post, auth }) =>
  async (dispatch) => {
    const newUser = { ...auth.user, saved: [...auth.user.saved, post._id] };
    dispatch({
      type: authTypes.REFRESH_INFO,
      payload: { ...auth, user: newUser },
    });

    try {
      await patchData(`savePost/${post._id}`, null, auth.token);
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const getPostsSavedAction =
  ({ post, auth }) =>
  async (dispatch) => {
    const newUser = {
      ...auth.user,
      saved: auth.user.saved.filter((id) => id !== post._id),
    };

    dispatch({
      type: authTypes.REFRESH_INFO,
      payload: { ...auth, user: newUser },
    });
    try {
      await patchData(`unSavePost/${post._id}`, null, auth.token);
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const unSavePostAction =
  ({ post, auth }) =>
  async (dispatch) => {
    const newUser = {
      ...auth.user,
      saved: auth.user.saved.filter((id) => id !== post._id),
    };

    dispatch({
      type: authTypes.REFRESH_INFO,
      payload: { ...auth, user: newUser },
    });
    try {
      await patchData(`unSavePost/${post._id}`, null, auth.token);
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };
