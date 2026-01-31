const bcrypt = require('bcryptjs');
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
    minlength: [6, "Password must be atleast 6 characters"]
  }
})

UserSchema.pre('save', async function () {
  if(!this.isModified('password')) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function() {
  return jwt.sign(
    {userId: this._id, name: this.name},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_LIFETIME}
  )
}

UserSchema.methods.comparePassword = async function(enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password)
  return isMatch
}

module.exports = mongoose.model('User',UserSchema)