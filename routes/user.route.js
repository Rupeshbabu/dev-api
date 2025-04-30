const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user.model');
const { createUser, deleteUser, getUsers, updateUser, getUserDetails } = require('../controllers/user.controller');
const advancedResults = require('../middleware/advanceResults');
const {protect, authorize} = require('../middleware/auth');


router.use(protect); // below this line apply every route check protect
router.use(authorize('admin'));

router.route('/').get(advancedResults(User), getUsers).post(createUser);
router.route('/:id').get(getUserDetails).put(updateUser).delete(deleteUser);



module.exports = router;