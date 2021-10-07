const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/emailer");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const crypto = require("crypto");

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
// @route   POST /api/v1/auth/forgotpasword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // determine if input email is an existing user
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorResponse(404, "There is no user with that email"));
    }

    // methods for reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    //  create reset protocol
    const resetUrl = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/auth/resetpassword/${resetToken}`;
    // message
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    // send email
    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset Token",
            message,
        });
        res.status(200).json({ success: true, data: "Email sent" });
    } catch (error) {
        console.log(error);

        // reset the two new variables awhile ago to undefined
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse(500, "Email not sent"));
    }
});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resettoken)
        .digest("hex");

    // find user through resettoken
    let user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    console.log(resetPasswordToken);
    if (!user) {
        return next(new ErrorResponse(400, "Invalid token"));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
});

// Helper function

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
