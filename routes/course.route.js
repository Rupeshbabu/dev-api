const express = require('express');
const {getCourses, getCourseDetails, addCourse, updateCourse, deleteCourse} = require('../controllers/course.controller');
const Course = require('../models/course.model');
const advanceResult = require('../middleware/advanceResults');
const { protect, authorize } = require('../middleware/auth');


const router = express.Router();


router.route('/').get(advanceResult(Course, {path:'dev', select: 'name, description'}), getCourses).post(protect, authorize('publisher', 'admin'),  addCourse);
router.route('/:id').get(getCourseDetails).put(protect, authorize('publisher', 'admin'), updateCourse).delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;