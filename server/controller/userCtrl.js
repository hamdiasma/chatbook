const User = require("../models/userModel");

const userCtrl = {
  searchUser: async (req, res) => {
    try {
      const users = await User.find({
        username: { $regex: req.query.username },
      })
        .limit(10)
        .select("fullname username avatar");

      res.json({ users });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select(["-password", "-defaultpassword"])
        .populate("followers following", "-password -defaultpassword");
      if (!user) {
        return res.status(400).json({ msg: "user not found" });
      }
      res.json({ user });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { avatar, fullname, mobile, address, story, website, gender } =
        req.body;
      if (!fullname)
        return res.status(400).json({ msg: "Please enter full name" });
      await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          avatar,
          fullname,
          mobile,
          address,
          story,
          website,
          gender,
        }
      );
      res.json({ msg: "Update with success" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  follow: async (req, res) => {
    try {
      // if user and if auth user exist for followers
      const user = await User.find({
        _id: req.params.id,
        followers: req.user._id,
      });
      if (user.length > 0) {
        return res.status(400).json({ msg: "User followed" });
      }

      const newUser = await User.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $push: { followers: req.user._id },
        },
        {
          new: true,
        }
      ).populate("followers following", "-password -defaultpassword");
      await User.findByIdAndUpdate(
        { _id: req.user._id },
        {
          $push: { following: req.params.id },
        },
        {
          new: true,
        }
      );
      res.json({ newUser });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  unFollow: async (req, res) => {
    try {
      const newUser = await User.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $pull: { followers: req.user._id },
        },
        {
          new: true,
        }
      ).populate("followers following", "-password -defaultpassword");
      await User.findByIdAndUpdate(
        { _id: req.user._id },
        {
          $pull: { following: req.params.id },
        },
        {
          new: true,
        }
      );
      res.json({ newUser });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  suggestions: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];
      const num = req.query.num || 9;
      const users = await User.aggregate([
        { $match: { _id: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
        {
          $lookup: {
            from: "users",
            localField: "followers",
            foreignField: "_id",
            as: "followers",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "following",
            foreignField: "_id",
            as: "following",
          },
        },
      ]).project("-password -defaultpassword");
      res.json({
        users,
        result: users.length,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = userCtrl;
