const express = require('express');
const router = express.Router({
    mergeParams: true
});
const appError = require('../utils/appError');
const wrapAsync = require('../utils/wrapAsync');
const Campground = require('../models/campground');
const {
    reviewSchema
} = require('../schemas');
const Review = require('../models/review');
const {
    validateReview,
    isLoggedIn,
    isReviewAuthor,
} = require('../loginmiddleware');
const reviewController = require('../controllers/reviews')



router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;