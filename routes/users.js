const express = require("express");

// route
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
} = require("../controllers/user");

// model
const User = require("../models/User");

// middleware
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

// prettier-ignore
router.route("/")
    .get(advancedResults(User), getUsers)
    .post(createUser);

// prettier-ignore
router.route("/:id")
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
