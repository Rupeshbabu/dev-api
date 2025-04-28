const {getDev, getDevDetails, postDev, updateDev, deleteDev, getDevInRadius, devPhotoUpoad} = require('../controllers/dev.controller');
const Dev = require('../models/dev.model');
const advanceResult = require('../middleware/advanceResults');

const express = require('express');
const router = express.Router();

//Include other resourses router

const courseRouter = require('../routes/course.route');

// Re-route into other resourse routes
router.use('/:dev/courses', courseRouter);

router.route('/').get(advanceResult(Dev, 'courses'), getDev).post(postDev);
router.route('/:id').get(getDevDetails).put(updateDev).delete(deleteDev);
router.route('/radius/:zipcode/:distance').get(getDevInRadius);
router.route('/:id/photo').put(devPhotoUpoad);

module.exports = router;
