const jwt = require('jsonwebtoken');
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
    minlength: [6, "Password must be atleast 6 characters"],
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
})

UserSchema.methods.createJWT = function() {
  return jwt.sign(
    {userId: this._id, name: this.name},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_LIFETIME}
  )
}

UserSchema.methods.comparePassword = function(enteredPassword) {
  return enteredPassword === this.password
}

module.exports = mongoose.model('User',UserSchema)