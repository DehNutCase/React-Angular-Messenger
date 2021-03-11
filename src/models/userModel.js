var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var validator = require("validator");

var userModel = new Schema({
  username: { type: String, required: [true, "Username is required!"] },
  password: { type: String, required: [true, "Password is required!"] },
  email: {
    type: String,
    required: [true, "Email is required!"],
    validate: {
      validator: validator.isEmail,
      message: (props) => `${props.value} is not a valid Email address!`,
    },
  },
});

module.exports = mongoose.model("user", userModel, "userList");
