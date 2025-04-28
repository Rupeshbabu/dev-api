const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/course.model");
const Dev = require("../models/dev.model");

// @desc    Get Courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/dev/:devId/course
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {

  if (req.params.devId) {
    const courses = await Course.find({ dev: req.params.devId });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    })
  } else {
    return res.status(200).json(res.advanceResult);
  }

  
});

// Single Course
exports.getCourseDetails = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "dev",
    select: "name description",
  });

  if (!course) {
    return next(
      new ErrorResponse(`no Course with the id of ${req.params.id}`, 404),
    );
  }

  return res.status(200).json({
    success: true,
    data: course,
  });
});

// Add course
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.dev = req.params.devId;

  const dev = await Dev.findById(req.params.devId);
  if (!dev) {
    return next(
      new ErrorResponse(`No Dev with the id ${req.params.devId}`, 404),
    );
  }

  const course = await Course.create(req.body);

  return res.status(200).json({
    success: true,
    data: course,
  });
});

// Update course
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.devId);
  if (!course) {
    return next(
      new ErrorResponse(`No Course with the id ${req.params.id}`, 404),
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    success: true,
    data: course,
  });
});

// Delete course
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.devId);
  if (!course) {
    return next(
      new ErrorResponse(`No Course with the id ${req.params.id}`, 404)
    );
  }
  await Course.removeAllListeners();
  return res.status(200).json({
    success: true,
    data: {},
  });
});
