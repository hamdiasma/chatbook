const mongoose = require("mongoose");

const notifycationSchema = new mongoose.Schema(
  {
    id: mongoose.Types.ObjectId,
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    recipients: [mongoose.Types.ObjectId],
    url: {
      type: String,
    },
    text: {
      type: String,
    },
    content: {
      type: String,
    },
    image: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("notify", notifycationSchema);
