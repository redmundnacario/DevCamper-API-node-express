const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

// @desc        Get all courses from a single bootcamp
// @route       GET /api/v1/courses
// @route       GET /api/v1/bootcamps/:bootcampId/courses
// @access      Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
        query = Course.find().populate({
            path: "bootcamp",
            select: "name description",
        });
    }

    const courses = await query;

    return res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
    });
});

// @desc        Get a course
// @route       GET /api/v1/courses/:id
// @access      Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: "bootcamp",
        select: "name description",
    });

    if (!course) {
        return next(
            new ErrorResponse(
                404,
                `Course with Id of ${req.params.id} was not found`
            )
        );
    }

    res.status(200).json({ success: true, course });
});

// @desc        Create a course
// @route       POST /api/v1/bootcamps/:bootcampId/courses
// @access      Private
exports.createCourse = asyncHandler(async (req, res, next) => {
    // get bootcamp id from params and assign to req body
    const bootcampId = req.params.bootcampId;
    req.body.bootcamp = bootcampId;

    // verify if course exist
    const bootcamp = await Bootcamp.findById(bootcampId);

    if (!bootcamp) {
        return next(
            new ErrorResponse(404, `No bootcamp with id of ${bootcampId}`)
        );
    }

    const course = await Course.create(req.body);
    res.status(201).json({ success: true, course });
});

// @desc        Update a course
// @route       PUT /api/v1/courses/:id
// @access      Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!course) {
        return next(
            new ErrorResponse(
                404,
                `Course with Id of ${req.params.id} was not found`
            )
        );
    }

    res.status(200).json({ success: true, data: course });
});

// @desc        Remove a course
// @route       DELETE /api/v1/courses/:id
// @access      Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
        return next(
            new ErrorResponse(
                404,
                `Course with Id of ${req.params.id} was not found`
            )
        );
    }

    res.status(200).json({ success: true, data: {} });
});
