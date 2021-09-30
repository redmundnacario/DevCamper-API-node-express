const express = require("express");
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
} = require("../controllers/courses");

// Schema
const Course = require("../models/Course");

// middleware
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
    .route("/")
    .get(
        advancedResults(Course, {
            path: "bootcamp",
            select: "name description",
        }),
        getCourses
    )
    .post(protect, authorize("pusblisher", "admin"), createCourse);

router
    .route("/:id")
    .get(getCourse)
    .put(protect, authorize("pusblisher", "admin"), updateCourse)
    .delete(protect, authorize("pusblisher", "admin"), deleteCourse);

module.exports = router;
