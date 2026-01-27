const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    maxlength: 50,
    minlength: 3,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: [8, "Password must be atleast 8 characters"],
    maxlength: 64,
    validate: {
      validator: function (value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value,
        );
      },
      message:
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    }
  }
});

module.exports = mongoose.model('User',UserSchema)