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
