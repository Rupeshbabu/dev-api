const ErrorResponse = require("../utils/errorResponse");
const Dev = require("../models/dev.model");
const asyncHandler = require("../middleware/async");
const geocoder = require('../utils/geoCoder');

//@dec Get All Dev
//@route GET /api/v1/dev
//@access Public
exports.getDev = asyncHandler(async (req, res, next) => {
  const getDevList = await Dev.find();
  return res
    .status(200)
    .json({ succes: true, count: getDevList.length, data: getDevList });
});

//@dec Get Single Dev
//@route GET /api/v1/dev/:id
//@access Public
exports.getDevDetails = asyncHandler(async (req, res, next) => {
  const getSingleDev = await Dev.findById(req.params.id);
  if (!getSingleDev) {
    return next(
      new ErrorResponse(`Dev not found with id of ${req.params.id}`, 404)
    );
  }
  return res.status(200).json({ succes: true, data: getSingleDev });
});

//@dec Post Dev
//@route POST /api/v1/dev
//@access Private
exports.postDev = asyncHandler(async (req, res, next) => {
  const devCreate = await Dev.create(req.body);
  return res.status(201).json({ succes: true, data: devCreate });
});

//@dec Update Dev
//@route PUT /api/v1/dev/:id
//@access Private
exports.updateDev = asyncHandler(async (req, res, next) => {
  const updatedDev = await Dev.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedDev) {
    return next(
      new ErrorResponse(`Dev not found with id of ${req.params.id}`, 404)
    );
  }
  return res.status(200).json({
    success: true,
    data: updatedDev,
  });
});

//@dec Delete Dev
//@route DELETE /api/v1/dev/:id
//@access Private
exports.deleteDev = asyncHandler(async (req, res, next) => {
  const deletedDev = await Dev.findByIdAndDelete(req.params.id);
  if (!deletedDev) {
    return next(
      new ErrorResponse(`Dev not found with id of ${req.params.id}`, 404)
    );
  }
  return res.status(200).json({
    success: true,
    data: {},
  });
});


//@dec Get dev with in radius Dev
//@route DELETE /api/v1/dev/radius/:zipcode/:distance
//@access Private
exports.getDevInRadius = asyncHandler(async (req, res, next) => {
   const {zipcode, distance} = req.params;

   //Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radius
    // Divide distance by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963

    const dev = await Dev.find({
        location: { $geoWithin: { $centerSphere: [ [lng, lat],  radius ] } }
    });

    return res.status(200).json({
        success: true,
        count: dev.length,
        data: dev
    })
  });