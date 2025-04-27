const {getDev, getDevDetails, postDev, updateDev, deleteDev, getDevInRadius} = require('../controllers/dev.controller');

const express = require('express');
const router = express.Router();

//Include other resourses router

const courseRouter = require('../routes/course.route');

// Re-route into other resourse routes
router.use('/:dev/courses', courseRouter);

router.route('/').get(getDev).post(postDev)
router.route('/:id').get(getDevDetails).put(updateDev).delete(deleteDev);
router.route('/radius/:zipcode/:distance').get(getDevInRadius)

module.exports = router;
