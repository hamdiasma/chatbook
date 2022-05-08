import { deleteData, patchData, postData } from "../../utils/fetchData";
import { editDataSimple, deleteDataSimple } from "../../utils/utilsFunction";
import { postTypes } from "../type/types";
import { alertAction } from "./alert";
import { createNotifyAction, removeNotifyAction } from "./notify";

export const createCommentAction =
  (post, newComment, auth, socket) => async (dispatch) => {
    const newPost = {
      ...post,
      comments: [...post.comments, newComment],
    };
    dispatch({ type: postTypes.EDITE_POST, payload: newPost });
    try {
      const data = {
        ...newComment,
        postId: post._id,
        postUserId: post.user._id,
      };
      const res = await postData("comments", data, auth.token);
      const newData = { ...res.data.newComment, user: auth.user };
      const newPost = {
        ...post,
        comments: [...post.comments, newData],
      };
      socket.emit("createComment", newPost);

      dispatch({ type: postTypes.EDITE_POST, payload: newPost });

      const msg = {
        id: res.data.newComment._id,
        text: newComment.reply
          ? "montioned you in a comment"
          : "has commented on your post",
        recipients: newComment.reply ? [newComment.tag._id] : [post.user._id],
        url: `/post/${post._id}`,
        content: post.content,
        image: post.images[0].url,
      };

      dispatch(createNotifyAction({ msg, auth, socket }));
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const updateCommentAction =
  ({ comment, content, post, auth }) =>
  async (dispatch) => {
    const newComment = editDataSimple(post.comments, comment._id, {
      ...comment,
      content,
    });
    const newPost = { ...post, comments: newComment };
    dispatch({
      type: postTypes.EDITE_POST,
      payload: newPost,
    });
    try {
      await patchData(`comments/${comment._id}`, { content }, auth.token);
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const likeCommentAction =
  ({ comment, post, auth }) =>
  async (dispatch) => {
    const newComment = { ...comment, likes: [...comment.likes, auth.user] };
    const newComments = editDataSimple(post.comments, comment._id, newComment);
    const newPost = { ...post, comments: newComments };
    dispatch({
      type: postTypes.EDITE_POST,
      payload: newPost,
    });
    try {
      await patchData(`comments/${comment._id}/like`, null, auth.token);
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const unLikeCommentAction =
  ({ comment, post, auth }) =>
  async (dispatch) => {
    const newComment = {
      ...comment,
      likes: deleteDataSimple(comment.likes, auth.user._id),
    };
    const newComments = editDataSimple(post.comments, comment._id, newComment);
    const newPost = { ...post, comments: newComments };
    dispatch({
      type: postTypes.EDITE_POST,
      payload: newPost,
    });
    try {
      await patchData(`comments/${comment._id}/unlike`, null, auth.token);
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };

export const deleteCommentAction =
  ({ post, auth, comment, socket }) =>
  async (dispatch) => {
    const deleteArr = [
      ...post.comments.filter((item) => item.reply === comment._id),
      comment,
    ];

    const newPost = {
      ...post,
      comments: post.comments.filter(
        (item) => !deleteArr.find((da) => item._id === da._id)
      ),
    };

    dispatch({
      type: postTypes.EDITE_POST,
      payload: newPost,
    });
    socket.emit("deleteComment", newPost);

    try {
      deleteArr.forEach((item) => {
        deleteData(`comments/${item._id}`, auth.token);
        const msg = {
          id: item._id,
          text: comment.reply
            ? "mentioned you in a comment."
            : "has commented on your post.",
          recipients: comment.reply ? [comment.tag._id] : [post.user._id],
          url: `/post/${post._id}`,
        };
        dispatch(removeNotifyAction({ msg, auth, socket }));
      });
    } catch (error) {
      dispatch(alertAction({ error: error.response.data.msg }));
    }
  };
