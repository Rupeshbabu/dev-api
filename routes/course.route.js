const express = require('express');
const {getCourses, getCourseDetails, addCourse, updateCourse, deleteCourse} = require('../controllers/course.controller');
const Course = require('../models/course.model');
const advanceResult = require('../middleware/advanceResults');
const { protect } = require('../middleware/auth');


const router = express.Router();


router.route('/').get(advanceResult(Course, {path:'dev', select: 'name, description'}), getCourses).post(protect, addCourse);
router.route('/:id').get(getCourseDetails).put(protect, updateCourse).delete(protect, deleteCourse);

module.exports = router;