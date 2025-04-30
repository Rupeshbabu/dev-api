const ErrorRespose = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Review = require("../models/review.model");
const Dev = require("../models/dev.model");

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.devId) {
    const review = await Review.find({ dev: req.params.devId });
    return res.status(200).json({
      success: true,
      count: review.length,
      data: review,
    });
  } else {
    return res.status(200).json(res.advancedResult);
  }
});

exports.getReviewDetails = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "Dev",
    select: "name description",
  });
  if (!review) {
    return next(
      new ErrorRespose(`No review found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    succes: true,
    data: review,
  });
});

exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.dev = req.params.devId;
  req.body.user = req.user.id;

  const dev = await Dev.findById(req.params.devId);

  if (!dev) {
    return next(
      new ErrorRespose(`No dev with te id of ${req.params.devId}`, 404)
    );
  }

  const review = await Review.create(req.body);

  return res.status(201).json({
    success: true,
    data: review,
  });
});

exports.updateReview = asyncHandler(async(req, res, next) => {
    let review = Review.findById(req.params.id);

    if(!review) {
        return next(new ErrorRespose(`No review with the id of ${req.params.id}`, 404));
    }

    // make sure review belongs to user or user is admin
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorRespose(`Not authorized to update review`, 401));
    }

     review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    return res.status(200).json({
        succes: true,
        data: review
    })
});

exports.deleteReview = asyncHandler(async(req, re, next) => {
    const review = await Review.findById(req.params.id);

    if(!review) {
        return next(new ErrorRespose(`No review with the id of ${req.params.id}`, 404))
    }

    // make sure review belongs to user or user is admin
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorRespose(`Not authorized to update review`, 401));
    }

    // await Review.findByIdAndDelete(req.params.id);
    await review.remove();

    return res.status(200).json({
        success: true,
        data: {}
    });
})
