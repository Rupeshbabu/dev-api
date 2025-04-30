const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review.model');
const { getReviews, getReviewDetails, addReview, updateReview, deleteReview } = require('../controllers/review.controller');
const advancedResults = require('../middleware/advanceResults');
const {protect, authorize} = require('../middleware/auth');


router.route('/').get(advancedResults(Review, {
    path:'dev',
    select: 'name, description'
}), getReviews).post(protect, authorize('user', 'admin'), addReview);

router.route('/:id').get(getReviewDetails).put(protect, authorize('user', 'admin'), updateReview).delete(protect, authorize('user', 'admin'), deleteReview);

module.exports = router;
