const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Register new User
// @route   GET /api/v1/users/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, confirm_password, role } = req.body;

    //check if email is already taken

    // check if password matches confirm_password
    if (password !== confirm_password) {
        return next(new ErrorResponse(400, "Passwords did not match"));
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    // create token
    const token = user.getSignedJwToken();

    res.status(200).json({
        success: true,
        token,
    });
});
