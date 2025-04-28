const {getDev, getDevDetails, postDev, updateDev, deleteDev, getDevInRadius, devPhotoUpoad} = require('../controllers/dev.controller');
const Dev = require('../models/dev.model');
const advanceResult = require('../middleware/advanceResults');

const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');

//Include other resourses router

const courseRouter = require('../routes/course.route');

// Re-route into other resourse routes
router.use('/:dev/courses', courseRouter);

router.route('/').get(advanceResult(Dev, 'courses'), getDev).post(protect, postDev);
router.route('/:id').get(getDevDetails).put(protect, updateDev).delete(protect, deleteDev);
router.route('/radius/:zipcode/:distance').get(getDevInRadius);
router.route('/:id/photo').put(protect, devPhotoUpoad);

module.exports = router;
