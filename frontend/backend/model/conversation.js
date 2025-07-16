const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    groupTitle: {
      type: String,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming you have a User model
      },
    ],
    lastMessage: {
      type: String,
    },
    lastMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);

