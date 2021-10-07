const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// Get all users

// @desc        Get all Users
// @route       GET /api/v1/users
// @access      Private/Admin only
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// Get a single user

// @desc        Get a Single User
// @route       GET /api/v1/users/:id
// @access      Private/Admin only
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    res.status(200).json({ success: true, data: user });
});

// Create a user

// @desc        Create a user
// @route       POST /api/v1/users
// @access      Private/Admin only
exports.createUser = asyncHandler(async (req, res, next) => {
    let user = await User.create(req.body);

    res.status(201).json({ success: true, data: user });
});

// Update user

// @desc        Update user info
// @route       PUT /api/v1/users/:id
// @access      Private/Admin only
exports.updateUser = asyncHandler(async (req, res, next) => {
    let user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({ success: true, data: user });
});

// Delete user

// @desc        Delete a user
// @route       DELETE /api/v1/users/:id
// @access      Private/Admin only
exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
});
