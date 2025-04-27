const express = require('express');
const {getCourses, getCourseDetails, addCourse, updateCourse, deleteCourse} = require('../controllers/course.controller');

const router = express.Router();


router.route('/').get(getCourses).post(addCourse);
router.route('/:id').get(getCourseDetails).put(updateCourse).delete(deleteCourse);

module.exports = router;