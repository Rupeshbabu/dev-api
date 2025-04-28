const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwtToken = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, 'Please enter email addres'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter valid email address"],
  },
  role: {
    type:String,
    enum:['user', 'publisher'],
    default: 'user'
  },
  password: {
    type: String,
    required:[true, 'Please enter your password'],
    minlength: 6,
    select: false // not showing in any result
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {timestamps: true});

//Encrypt password using bcrypt
UserSchema.pre('save', async function(next){
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwtToken.sign({id: this._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

//match user entered password to hashed password in db
UserSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model("User", UserSchema);
