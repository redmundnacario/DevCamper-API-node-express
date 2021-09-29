const express = require("express");
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    udpdateBootcamp,
    deleteBootcamp,
    getBootCampsWithinRadius,
    uploadImageBootcamp,
} = require("../controllers/bootcamps");

// Schema
const Bootcamp = require("../models/Bootcamp");

// middleware
const advancedResults = require("../middleware/advancedResults");
const { protect } = require("../middleware/auth");
// inlude other resoucce router
const courseRouter = require("./courses");

const router = express.Router();

// pass it to ./course routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootCampsWithinRadius);

router
    .route("/")
    .get(advancedResults(Bootcamp, "courses"), getBootcamps)
    .post(protect, createBootcamp);

router.route("/:id/photo").put(uploadImageBootcamp);

router
    .route("/:id")
    .get(getBootcamp)
    .put(protect, udpdateBootcamp)
    .delete(protect, deleteBootcamp);

module.exports = router;
