const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const User = require("../models/userModel");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const postCtrl = {
  createPost: async (req, res) => {
    try {
      const { content, images } = req.body;
      if (images.length === 0)
        return res.status(400).json({ msg: "Please add your Image" });
      const newPost = new Post({
        content,
        images,
        user: req.user._id,
      });
      await newPost.save();
      res.json({
        msg: "create new post",
        newPost: {
          ...newPost._doc,
          user: req.user,
        },
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getPosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Post.find({
          user: [...req.user.following, req.user._id],
        }),
        req.query
      ).paginating();
      const posts = await features.query
        .sort("-createdAt")
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password -defaultpassword",
          },
        });

      res.json({
        msg: "success",
        result: posts.length,
        posts,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updatePost: async (req, res) => {
    try {
      const { content, images } = req.body;
      const post = await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          content,
          images,
        }
      )
        .populate("user likes", "avatar username fullname")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password -defaultpassword",
          },
        });

      res.json({
        msg: "post updated",
        newPost: {
          ...post._doc,
          content,
          images,
        },
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  likePost: async (req, res) => {
    try {
      const post = await Post.find({ _id: req.params.id, likes: req.user._id });
      if (post.length > 0) {
        return res.status(400).json({ msg: "You alady like this post." });
      }
      const like = await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );
      if (!like) return res.status(400).json({ msg: "Post does not exist." });
      res.json({
        msg: "post was liked!",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  unLikePost: async (req, res) => {
    try {
      const unlike = await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );
      if (!unlike) return res.status(400).json({ msg: "Post does not exist." });

      res.json({
        msg: "post was unliked!",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUserPosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Post.find({ user: req.params.id }),
        req.query
      ).paginating();
      const posts = await features.query.sort("-createdAt");
      res.json({
        posts: posts,
        result: posts.length,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password -defaultpassword",
          },
        });
      if (!post) return res.status(400).json({ msg: "Post does not exist." });

      res.json({
        post,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getPostDiscover: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];

      const num = req.query.num || 9;

      const posts = await Post.aggregate([
        { $match: { user: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
      ]);

      return res.json({
        msg: "Success!",
        result: posts.length,
        posts,
      });

      // const features = new APIfeatures(
      //   Post.find({
      //     user: { $nin: [...req.user.following, req.user._id] },
      //   }),
      //   req.query
      // ).paginating();

      // const posts = await features.query.sort("-createdAt");

      // res.json({
      //   msg: "success",
      //   result: posts.length,
      //   posts,
      // });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deletePost: async (req, res) => {
    try {
      const post = await Post.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });
      await Comment.deleteMany({ _id: { $in: post.comments } });
      res.json({
        msg: "Post deleted with success.!",
        newPost: {
          ...post,
          user: req.user,
        },
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  savedPost: async (req, res) => {
    try {
      const user = await User.find({ _id: req.user._id, saved: req.params.id });
      if (user.length > 0) {
        return res.status(400).json({ msg: "You alady saved this post." });
      }
      const save = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { saved: req.params.id },
        },
        { new: true }
      );
      if (!save) return res.status(400).json({ msg: "User does not exist." });
      res.json({
        msg: "post was saved!",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  unSavedPost: async (req, res) => {
    try {
      const unSave = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { saved: req.params.id },
        },
        { new: true }
      );
      if (!unSave) return res.status(400).json({ msg: "User does not exist." });

      res.json({
        msg: "post was unSaved!",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getSavedPost: async (req, res) => {
    try {
      const features = new APIfeatures(
        Post.find({ _id: { $in: req.user.saved } }),
        req.query
      ).paginating();
      const savePosts = await features.query.sort("-createdAt");
      res.json({
        savePosts,
        result: savePosts.length,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = postCtrl;
