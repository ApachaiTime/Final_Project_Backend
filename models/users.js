const mongoose = require("mongoose");
const validator = require("validator");
const bycrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 20,
  },

  avatar: {
    type: String,
    validate(value) {
      return validator.isURL(value, { require_tld: false });
    },
    message: "You must enter a valid URL",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      return validator.isEmail(value);
    },
    message: "You must enter a valid Emal address",
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
  zipCode: {
    type: String,
    required: true,
    validate(value) {
      return validator.isPostalCode(value, "US");
    },
    message: "You must enter a valid zip code",
  },
  savedParks: {
    type: [String],
    default: [],
  },
});

UserSchema.statics.findByCred = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("User not found"));
      }
      return bycrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect password"));
        }
        return user;
      });
    });
};
module.exports = mongoose.model("user", UserSchema);
