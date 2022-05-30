const Notifies = require("../models/notifycationModel");

const notifyCtrl = {
  createNotify: async (req, res) => {
    try {
      const { id, recipients, text, content, url, image } = req.body;
      if (recipients.includes(req.user._id.toString())) return;
      const newNotify = new Notifies({
        id,
        recipients,
        text,
        content,
        url,
        image,
        user: req.user._id,
      });
      await newNotify.save();
      res.json({
        newNotify,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  removeNotify: async (req, res) => {
    try {
      const newNotify = await Notifies.findOneAndDelete({
        id: req.params.id,
        url: req.query.url,
      });
      res.json({
        newNotify,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getNotifies: async (req, res) => {
    try {
      const notifies = await Notifies.find({ recipients: req.user._id })
        .sort("isRead")
        .sort("-createdAt")
        .populate("user", "avatar username");
      res.json({
        notifies,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  isReadNotify: async (req, res) => {
    try {
      const notifies = await Notifies.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        { isRead: true }
      );

      res.json({
        notifies,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deletaAllNotifies: async (req, res) => {
    try {
      await Notifies.deleteMany({
        recipients: req.user._id,
      });

      res.json({
        msg: "delete all notifies",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = notifyCtrl;
