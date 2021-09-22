const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
    console.log(err.stack.red);

    let error = { ...err }; // if a custom error object, error.statusCode is present
    error.message = err.message;
    // console.log(err.message);

    let message;

    // MongoServerError with code 1100
    if (err.code === 11000) {
        // when a document already exists based on unique field
        message = "Resource already exists";
        error = new ErrorResponse(400, message);
    }

    switch (err.name) {
        case "CastError":
            //  When a document does not exists in DB
            message = `Resource not found`;
            error = new ErrorResponse(404, message);
            break;
        case "ValidationError":
            // When a required field in req.body is missing
            // console.log(error.errors);
            message = Object.values(err.errors).map((val) => val.message);
            error = new ErrorResponse(400, message);
            break;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
    });
};

module.exports = errorHandler;
