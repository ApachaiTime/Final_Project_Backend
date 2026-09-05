const mongoose = require("mongoose");
const comments = require("../models/comments");
const users = require("../models/users");
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_ERROR,
} = require("../utils/errors");

const getComments = (req, res) => {
  comments
    .find({})
    .then((comments) => {
      res.json(comments);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Comments not found" });
      }
      res.status(INTERNAL_ERROR).send({ message: "Internal server error" });
    });
};

const createComment = (req, res) => {
  const { parkCode, authorName, text, createdAt } = req.body;
  users
    .findById(req.user._id)
    .orFail()
    .then((foundUser) => {
      console.log("user", foundUser);
      return comments
        .create({
          parkCode: req.body.parkCode,
          userId: foundUser._id,
          authorName: foundUser.name,
          text: req.body.text,
        })
        .orFail()
        .then((newComment) => {
          console.log(newComment);
          res.json(newComment);
        });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      } else if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Required fields missing" });
      }
      res.status(INTERNAL_ERROR).send({ message: "Internal server error" });
    });
};
const deleteComment = (req, res) => {
  comments
    .findByIdAndDelete(req.params._id)
    .orFail()
    .then(() => {
      res.status(200).send({ message: "Comment delelted" });
    })
    // Add error handling
    .catch((err) => {
      console.log("message", err.name);
      if (err.name === "CastError") {
        return res.status(NOT_FOUND).send({ message: "Comment not found" });
      }
      res.status(INTERNAL_ERROR).send({ message: "Internal server error" });
    });
};
module.exports = {
  getComments,
  createComment,
  deleteComment,
};
