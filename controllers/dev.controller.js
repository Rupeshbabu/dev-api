const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const Dev = require("../models/dev.model");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geoCoder");
const advanceResult = require("../middleware/advanceResults");

//@dec Get All Dev
//@route GET /api/v1/dev
//@access Public
exports.getDev = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.advanceResult);
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

  //Add user to req.body
  req.body.user = req.user.id;
  const devCreate = await Dev.create(req.body);

  // Check for published dev
  const publishedDev = await Dev.findOne({user: req.user.id});
  
  // if user is not an admin, they can only add one dev
  if(publishedDev && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User with id ${req.user.id} has already published a Dev`, 400));
  }

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

  //Make sure user is dev owner
  if(updatedDev.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this dev`, 401))
  }

  updatedDev = await Dev.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  return res.status(200).json({
    success: true,
    data: updatedDev,
  });
});

//@dec Delete Dev
//@route DELETE /api/v1/dev/:id
//@access Private
exports.deleteDev = asyncHandler(async (req, res, next) => {
  const deletedDev = await Dev.findById(req.params.id);
  if (!deletedDev) {
    return next(
      new ErrorResponse(`Dev not found with id of ${req.params.id}`, 404)
    );
  }

  //Make sure user is dev owner
  if(deletedDev.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this dev`, 401))
  }

  deletedDev.remove();
  return res.status(200).json({
    success: true,
    data: {},
  });
});

//@dec Get dev with in radius Dev
//@route DELETE /api/v1/dev/radius/:zipcode/:distance
//@access Private
exports.getDevInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radius
  // Divide distance by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const dev = await Dev.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  return res.status(200).json({
    success: true,
    count: dev.length,
    data: dev,
  });
});

// Upload Photo for dev
exports.devPhotoUpoad = asyncHandler(async (req, res, next) => {
  const dev = await Dev.findById(req.params.id);

  if (!dev) {
    return next(
      new ErrorResponse(`dev not found with id of ${req.params.id}`, 404)
    );
  }
  
   //Make sure user is dev owner
   if(dev.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this dev`, 401))
  }


  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  //Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload a image file`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filname
  file.name = `photo_${dev._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Dev.findByIdAndUpdate(req.params.id, { photo: file.name });

    return res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
