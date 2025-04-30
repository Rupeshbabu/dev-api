const jwtToken = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorRespose = require("../utils/errorResponse");
const User = require("../models/user.model");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {

    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];

    // Set token from cookie
  } 
  // else if(req.cookies.token){
  //     token = req.cookies.token
  // }

  //Make sure token exists
  if (!token) {
    return next(new ErrorRespose("Not authorize to access this route", 401));
  }

  try {
    // Verify Token
    const decode = jwtToken.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decode.id);

    next();
  } catch (error) {
    console.log(error);
  }
});


// Grant access tp specific roles
exports.authorize = (...roles) => {
  return (req,res,next) => {
    if(!roles.includes(req.user.role)){
      return next(new ErrorRespose(`User role ${req.user.role} is not authorized to access this route`, 403));
    }
    next();
  }
}