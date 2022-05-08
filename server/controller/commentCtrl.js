const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const commentCtrl = {
  createComment: async (req, res) => {
    try {
      const { postId, content, tag, reply, postUserId } = req.body;
      const post = await Post.findById(postId);
      if (!post) return res.status(400).json({ msg: "Post does not exist.!" });
      if (reply) {
        const cm = await Comment.findById(reply);
        if (!cm)
          return res.status(400).json({ msg: "Comment does not exist.!" });
      }

      const newComment = new Comment({
        user: req.user._id,
        content,
        tag,
        reply,
        postId,
        postUserId,
      });

      await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { comments: newComment._id } },
        {
          new: true,
        }
      );
      await newComment.save();
      res.json({ newComment });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateComment: async (req, res) => {
    try {
      const { content } = req.body;
      await Comment.findOneAndUpdate({ _id: req.params.id }, { content });

      res.json({ msg: "update success!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  likeComment: async (req, res) => {
    try {
      const comment = await Comment.find({
        _id: req.params.id,
        likes: req.user._id,
      });
      if (comment.length > 0) {
        return res.status(400).json({ msg: "You alady like this Comment." });
      }
      await Comment.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );

      res.json({
        msg: "comment was liked!",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  unLikePost: async (req, res) => {
    try {
      await Comment.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );
      res.json({
        msg: "comment was unliked!",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findOneAndDelete({
        _id: req.params.id,
        // $or: [
        //   {
        //     user: req.user._id,
        //   },
        //   {
        //     postUserId: req.user._id,
        //   },
        // ],
      });
      await Post.findOneAndUpdate(
        { _id: comment.postId },
        {
          $pull: { comments: req.params.id },
        }
      );

      res.json({
        msg: "delete successfuly!",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = commentCtrl;
