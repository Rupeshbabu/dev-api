const ErrorRespose = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/user.model");

// Create User
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //Create User
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  //Create token
  const token = user.getSignedJwtToken();

  return res.status(201).json({
    success: true,
    token,
  });
});

//Login user
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(
      new ErrorRespose("Please provide valid email and password", 400)
    );
  }

  //Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorRespose("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorRespose("Invalid credentials", 401));
  }

  const token = user.getSignedJwtToken();

  return res.status(200).json({
    success: true,
    token,
  });
});
