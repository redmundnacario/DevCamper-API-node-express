const express = require("express");
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    udpdateBootcamp,
    deleteBootcamp,
    getBootCampsWithinRadius,
} = require("../controllers/bootcamps");

const router = express.Router();

router.route("/radius/:zipcode/:distance").get(getBootCampsWithinRadius);

router.route("/").get(getBootcamps).post(createBootcamp);

router
    .route("/:id")
    .get(getBootcamp)
    .put(udpdateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;
