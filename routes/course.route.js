const express = require('express');
const {getCourses, getCourseDetails, addCourse, updateCourse, deleteCourse} = require('../controllers/course.controller');
const Course = require('../models/course.model');
const advanceResult = require('../middleware/advanceResults');

const router = express.Router();


router.route('/').get(advanceResult(Course, {path:'dev', select: 'name, description'}), getCourses).post(addCourse);
router.route('/:id').get(getCourseDetails).put(updateCourse).delete(deleteCourse);

module.exports = router;