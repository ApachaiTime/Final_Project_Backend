const mongoose = require("mongoose");
const validator = require("validator");

const CommentSchema = new mongoose.Schema({
  parkCode: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    red: "User",
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },

  text: {
    type: String,
    required: true,
    trim: true,
    maxLength: 2000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// this is undefiend
// Comment.index({ parkCode: 1, createdAt: -1 });
module.exports = mongoose.model("comments", CommentSchema);
