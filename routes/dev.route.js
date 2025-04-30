const {getDev, getDevDetails, postDev, updateDev, deleteDev, getDevInRadius, devPhotoUpoad} = require('../controllers/dev.controller');
const Dev = require('../models/dev.model');
const advanceResult = require('../middleware/advanceResults');

const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

//Include other resourses router

const courseRouter = require('../routes/course.route');
const reviewRouter = require('../routes/review.route');

// Re-route into other resourse routes
router.use('/:devId/courses', courseRouter);
router.use('/:devId/review', reviewRouter);


router.route('/').get(advanceResult(Dev, 'courses'), getDev).post(protect, authorize('publisher', 'admin'), postDev);
router.route('/:id').get(getDevDetails).put(protect, authorize('publisher', 'admin'), updateDev).delete(protect, authorize('publisher', 'admin'),  deleteDev);
router.route('/radius/:zipcode/:distance').get(getDevInRadius);
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'),  devPhotoUpoad);

module.exports = router;
