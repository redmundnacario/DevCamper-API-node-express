const asyncHandler = require("../middleware/asyncHandler");
const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");

// Get all reviews

// @desc        Get all reviews
// @route       GET /api/v1/reviews/
// @route       GET /api/v1/bootcamps/:bootcampId/reviews
// @access      Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId });
        return res
            .status(200)
            .json({ success: true, count: reviews.length, data: reviews });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// Get a Single Review

// @desc        Get a Single Review
// @route       GET /api/v1/reviews/:id
// @access      Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        return next(
            new ErrorResponse(
                404,
                `No review with id of ${req.params.bootcampId}`
            )
        );
    }
    res.status(200).json({ success: true, data: review });
});

// Create a Single Review

// @desc        Create a Single Review
// @route       POST /api/v1/bootcamps/:bootcampId/reviews
// @access      Private
exports.createReview = asyncHandler(async (req, res, next) => {
    // get user info from req (see protect() in ../middleware/auth.js)
    req.body.user = req.user.id;
    req.body.bootcamp = req.params.bootcampId;

    let bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(
            new ErrorResponse(
                404,
                `No bootcamp with id of ${req.params.bootcampId}`
            )
        );
    }
    const review = await Review.create(req.body);

    res.status(201).json({ success: true, data: review });
});

// Update a Single Review

// @desc        Update a Single Review
// @route       PUT /api/v1/reviews/:id
// @access      Private
exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);
    if (!review) {
        return next(
            new ErrorResponse(404, `No review with id of ${req.params.id}`)
        );
    }

    // ownership and admin access
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(
            new ErrorResponse(401, `User not authorized to update review`)
        );
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({ success: true, data: review });
});

// Delete a Single Review

// @desc        Delete a Single Review
// @route       DELETE /api/v1/reviews/:id
// @access      Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);
    if (!review) {
        return next(
            new ErrorResponse(
                404,
                `No review with id of ${req.params.bootcampId}`
            )
        );
    }

    // ownership and admin access
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(
            new ErrorResponse(401, `User not authorized to delete review`)
        );
    }

    await review.remove();
    res.status(200).json({ success: true, data: {} });
});
