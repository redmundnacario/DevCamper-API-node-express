const express = require("express");
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    udpdateBootcamp,
    deleteBootcamp,
    getBootCampsWithinRadius,
} = require("../controllers/bootcamps");

// inlude other resoucce router
const courseRouter = require("./courses");

const router = express.Router();

// pass it to ./course routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootCampsWithinRadius);

router.route("/").get(getBootcamps).post(createBootcamp);

router
    .route("/:id")
    .get(getBootcamp)
    .put(udpdateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;
