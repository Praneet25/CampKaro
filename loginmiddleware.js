const Campground = require('./models/campground');
const {
    campgroundSchema,
    reviewSchema
} = require('./schemas');
const express = require('express');
const router = express.Router();
const appError = require('./utils/appError');
const wrapAsync = require('./utils/wrapAsync');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must login to view this page');
        res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const {
        id
    } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect('/campgrounds')
    };
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {
        error
    } = reviewSchema.validate(req.body);
    console.log(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new appError(msg, 400)
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res,next) => {
    // const campground = new Campground(req.body.campground)
    // campground.author = req.user._id;
    // await campground.save()
    // req.flash('success', 'campground created successfully!')
    // res.redirect(`/campgrounds/${campground._id}`)
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();

}