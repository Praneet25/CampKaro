const express = require('express');
const router = express.Router();
const appError = require('../utils/appError');
const wrapAsync = require('../utils/wrapAsync');
const campgrounds = require('../controllers/campground')
const {
    isLoggedIn,
    isAuthor
} = require('../loginmiddleware');
const {
    campgroundSchema,
} = require('../schemas');

const {
    storage
} = require('../cloudinary');
const multer = require('multer');
const upload = multer({
    storage
});

const Campground = require('../models/campground');
const user = require('../models/user');



router.route('/')
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), campgroundSchema, wrapAsync(campgrounds.createCampground))


router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm));


router.route('/:id')
    .get(wrapAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), campgroundSchema, wrapAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCamground));




module.exports = router;
// 