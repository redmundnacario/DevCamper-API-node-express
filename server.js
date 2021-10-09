const path = require("path");
const express = require("express");
const morgan = require("morgan"); // third-party logger middleware
const colors = require("colors");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Middlewares
// const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const ErrorResponse = require("./utils/errorResponse");

// Route files
const auth = require("./routes/auth");
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

const app = express();

// Pre-middlewares
app.use(express.json()); // Json Body parser
app.use(cookieParser()); // for parsing cookie
app.use(fileUpload()); // File or image uploading

// Security middlewares
app.use(mongoSanitize()); // Sanitize data/inputs in routes
app.use(helmet()); // set security headers
app.use(xss()); // disables xss
// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100,
});
app.use(limiter);
app.use(hpp()); // Prevent http param pollution
app.use(cors()); // enable CORS

// Dev logging middlewares
// app.use(logger); //--> using custom logger
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Set static folder - for file/image uploads dest
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

//fall back error if no routes detected
app.use((req, res, next) => {
    return next(new ErrorResponse(404, "404 Not found!"));
});

// Post-middlewares
app.use(errorHandler);

// export app
module.exports = app;
