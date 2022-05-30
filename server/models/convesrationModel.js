const mongoose = require("mongoose");

const conversationtSchema = new mongoose.Schema(
  {
    recipients: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    text: String,
    call: Object,
    media: Array,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("conversation", conversationtSchema);
