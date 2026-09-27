const users = require("../models/users");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const bycrypt = require("bcryptjs");
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT_ERROR,
  INTERNAL_ERROR,
} = require("../utils/errors");
// done
const signup = (req, res) => {
  const { email, password, confirmPass, avatar, zipCode } = req.body;

  if (!email || !password || !confirmPass) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Fill all input fields to continue" });
  }

  if (password !== confirmPass) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Password fields don't match" });
  }

  bycrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      return users.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        confirmPass: hash,
        zipCode: req.body.zipCode,
      });
    })
    .then((newUser) => {
      const createdUser = newUser.toObject();
      delete createdUser.password;
      res.status(201).json(createdUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided" });
      }
      if (err.name === "MongoServerError")
        return res
          .status(CONFLICT_ERROR)
          .send({ message: "Email already in use" });
    });
};
// done
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password must be provided" });
  }
  return users
    .findByCred(email, password)
    .then((foundUser) => {
      const token = jwt.sign({ _id: foundUser._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({
        token,

        user: {
          _id: foundUser._id,
          name: foundUser.name,
          zipCode: foundUser.zipCode,
          avatar: foundUser.avatar,
          savedParks: foundUser.savedParks,
        },
      });
    })
    .catch((err) => {
      console.log("message", err.message);
      if (err.message === "User not found") {
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Invalid email or password" });
      }
      if (err.message === "Incorrect password") {
        return res.status(UNAUTHORIZED).send("Invalid email or password");
      }
    });
};

const getUser = (req, res) => {
  users
    .findById(req.user._id)
    .orFail()
    .then((currentUser) => {
      res.json(currentUser);
    })

    .catch((err) => {
      console.log("message", err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
    });
};

const updateUser = (req, res) => {
  const updates = {};
  if (req.body.name !== undefined) updates.name = req.body.name;
  if (req.body.zipCode !== undefined) updates.zipCode = req.body.zipCode;
  if (req.body.savedParks !== undefined)
    updates.savedParks = req.body.savedParks;
  if (req.file) {
    updates.avatar = `${req.protocol}://${req.get("host")}/uploads/avatars/${
      req.file.filename
    }`;
  } else if (req.body.avatar !== undefined) {
    updates.avatar = req.body.avatar;
  }

  users
    .findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    })
    .then((updatedUser) => {
      res.json(updatedUser);
    })

    .catch((err) => {
      console.log("message", err);
      if (err._message === "Validation failed") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided for update" });
      }
    });
};

module.exports = {
  login,
  signup,
  updateUser,
  getUser,
};
