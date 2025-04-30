const ErrorRespose = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/user.model");

exports.getUsers = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advancedResults);
});

// Single User
exports.getUserDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.param.id);
  return res.status(200).json({ success: true, data: user });
});

//Create user
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    return res.status(200).json({ success: true, data: user });
  });

//Update user
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    return res.status(200).json({ success: true, data: user });
  });

//Delete user
exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, data: {}});
  });