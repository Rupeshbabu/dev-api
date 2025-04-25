const ErrorResponse = require('../utils/errorResponse');
const Dev = require("../models/dev.model");

//@dec Get All Dev
//@route GET /api/v1/dev
//@access Public
exports.getDev = async (req, res, next) => {
  try {
    const getDevList = await Dev.find();
    return res
      .status(200)
      .json({ succes: true, count: getDevList.length, data: getDevList });
  } catch (error) {
    next(error);
  }
};

//@dec Get Single Dev
//@route GET /api/v1/dev/:id
//@access Public
exports.getDevDetails = async (req, res, next) => {
  try {
    const getSingleDev = await Dev.findById(req.params.id);
    if (!getSingleDev) {
        return next(new ErrorResponse(`Dev not found with id of ${req.params.id}`, 404));
    }
    return res.status(200).json({ succes: true, data: getSingleDev });
  } catch (error) {
    next(error);
  }
};

//@dec Post Dev
//@route POST /api/v1/dev
//@access Private
exports.postDev = async (req, res, next) => {
  try {
    const devCreate = await Dev.create(req.body);
    return res.status(201).json({ succes: true, data: devCreate });
  } catch (error) {
    next(error);
  }
};

//@dec Update Dev
//@route PUT /api/v1/dev/:id
//@access Private
exports.updateDev = async (req, res, next) => {
  try {
    const updatedDev = await Dev.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedDev) {
        return next(new ErrorResponse(`Dev not found with id of ${req.params.id}`, 404));
    }
    return res.status(200).json({
      success: true,
      data: updatedDev,
    });
  } catch (error) {
   next(error);
  }
};

//@dec Delete Dev
//@route DELETE /api/v1/dev/:id
//@access Private
exports.deleteDev = async (req, res, next) => {
  try {
    const deletedDev = await Dev.findByIdAndDelete(req.params.id);
    if (!deletedDev) {
        return next(new ErrorResponse(`Dev not found with id of ${req.params.id}`, 404));
    }
    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
