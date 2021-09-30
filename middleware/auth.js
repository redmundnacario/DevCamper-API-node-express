const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    // verify if req.Authorization exists and bearer exists... else error
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    // else if (req.cookies.token) {
    //     token = req.cookies.token;
    // }

    // if token not exists
    if (!token) {
        return next(new ErrorResponse(401, "Unauthorized access"));
    }

    // verify token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        return next(new ErrorResponse(401, "Unauthorized access"));
    }
});

//prettier-ignore
exports.authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ErrorResponse(403, "User role is unauthorized"));
    }
    next();
};
