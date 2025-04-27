const path = require('path');
const ErrorResponse = require("../utils/errorResponse");
const Dev = require("../models/dev.model");
const asyncHandler = require("../middleware/async");
const geocoder = require('../utils/geoCoder');

//@dec Get All Dev
//@route GET /api/v1/dev
//@access Public
exports.getDev = asyncHandler(async (req, res, next) => {
  
  let query;

  //Copy req.query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];
  
  // Loop over removefields and delete them from reqQuery
  removeFields.forEach(params => delete reqQuery[params]);

  // Create query string
  let queryStr = JSON.stringify(req.query);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resources
  query = Dev.find(JSON.parse(queryStr)).populate('courses');

  // SELECT FIELDS
  if(req.query.select){
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort

  if(req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }else {
    query = query.sort('-createdAt')
  }

  //Paginaton
  const page = parseInt(req.query.page, 2) || 1;
  const limit = parseInt(req.query.limit, 2) || 100;
  const startIndex = (page-1)*limit;
  const endIndex = page * limit
  const total = await Dev.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const getDevList = await query;

  // Paginaton result
  const pagination = {};
  if(endIndex < total){
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if(startIndex > 0) {
    pagination.pre ={
      page: page - 1,
      limit
    }
  }


  return res
    .status(200)
    .json({ succes: true, count: getDevList.length, pagination, data: getDevList });
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
  const deletedDev = await Dev.findById(req.params.id);
  if (!deletedDev) {
    return next(
      new ErrorResponse(`Dev not found with id of ${req.params.id}`, 404)
    );
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

  // Upload Photo for dev
  exports.devPhotoUpoad = asyncHandler(async(req, res, next) => {
    const dev = await Dev.findById(req.params.id);

    if(!dev){
      return next(new ErrorResponse(`dev not found with id of ${req.params.id}`, 404));
    }

    if(!req.files) {
      return next(new ErrorResponse(`Please upload a file`,400));
    }

    const file = req.files.file

    //Make sure the image is a photo
    if(!file.mimetype.startsWith('image')){
      return next(new ErrorResponse(`Please upload a image file`, 400));
    }

    // Check file size
    if(file.size > process.env.MAX_FILE_UPLOAD){
      return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    // Create custom filname
    file.name = `photo_${dev._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err =>{
      if(err){
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }

      await Dev.findByIdAndUpdate(req.params.id, {photo: file.name});

      return res.status(200).json({
        success: true,
        data: file.name
      })
    })

    
  })