const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Register new User
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    //check if email is already taken
    //check if email exists is already handled by Schema if "unique: true"

    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    // create token
    const token = user.getSignedJwToken();

    res.status(201).json({
        success: true,
        token,
    });
});

// @desc    Login an existing User
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // check if email and password in req.body
    if (!email || !password) {
        return next(
            new ErrorResponse(400, "Please provide email and password")
        );
    }

    // check if email is already taken
    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
        return next(new ErrorResponse(401, "Invalid credentials"));
    }

    // check if inputpassword matches password in DB
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse(401, "Invalid credentials"));
    }

    // create token
    const token = user.getSignedJwToken();

    res.status(200).json({
        success: true,
        token,
    });
});
