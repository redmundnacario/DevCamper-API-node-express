const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Register new User
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    //check if email is already taken
    let existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return next(new ErrorResponse(400, "User account already exists"));
    }
    //check if email exists is already handled by Schema if "unique: true"

    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    sendTokenResponse(user, 200, res);
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

    sendTokenResponse(user, 200, res);
});

// @desc    Get existing user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
});

// @desc    Create hashed token for forgot password scenario
// @route   POST /api/v1/auth/forgot-pasword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // determine if input email is an existing user
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorResponse(404, "There is no user with that email"));
    }

    // methods
    user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        data: user,
    });
});

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }

    res.status(statusCode)
        .cookie("token", token, options)
        .json({ success: true, token: token });
};
