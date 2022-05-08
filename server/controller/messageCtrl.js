const Conversations = require("../models/convesrationModel");
const Message = require("../models/messageModel");

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
const messageCtrl = {
  createMessage: async (req, res) => {
    try {
      const { sender, recipient, text, media, call } = req.body;
      if (!recipient || (!text.trim() && media.length === 0 && !call)) return;

      const newConversation = await Conversations.findOneAndUpdate(
        {
          $or: [
            { recipients: [sender, recipient] },
            { recipients: [recipient, sender] },
          ],
        },
        {
          recipients: [sender, recipient],
          text,
          media,
          call,
        },
        {
          new: true,
          upsert: true,
        }
      );

      const newMessage = new Message({
        conversation: newConversation._id,
        sender,
        call,
        recipient,
        text,
        media,
      });

      await newMessage.save();
      res.json({
        msg: "create success!",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getConversation: async (req, res) => {
    try {
      const features = new APIfeatures(
        Conversations.find({
          recipients: req.user._id,
        }),
        req.query
      ).paginating();

      const conversaions = await features.query
        .sort("-updatedAt")
        .populate("recipients", "avatar username fullname updatedAt");
      res.json({
        conversaions,
        result: conversaions.length,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getMessages: async (req, res) => {
    try {
      const features = new APIfeatures(
        Message.find({
          $or: [
            {
              sender: req.user._id,
              recipient: req.params.id,
            },
            {
              sender: req.params.id,
              recipient: req.user._id,
            },
          ],
        }),
        req.query
      ).paginating();

      const messages = await features.query.sort("-createdAt");

      res.json({
        messages,
        result: messages.length,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  deleteMessage: async (req, res) => {
    try {
      await Message.findOneAndDelete({
        _id: req.params.id,
        sender: req.user._id,
      });
      res.json({
        msg: "message was deleted.!",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  deleteConversation: async (req, res) => {
    try {
      const newConversation = await Conversations.findOneAndDelete({
        $or: [
          { recipients: [req.params.id, req.user._id] },
          { recipients: [req.user._id, req.params.id] },
        ],
      });

      await Message.deleteMany({
        conversation: newConversation._id,
      });
      res.json({
        msg: "Conversation was deleted.!",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = messageCtrl;
