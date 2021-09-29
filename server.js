const path = require("path");
const express = require("express");
const morgan = require("morgan"); // third-party logger middleware
const colors = require("colors");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Middlewares
// const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

// Route files
const auth = require("./routes/auth");
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

const app = express();

// Pre-middlewares
app.use(express.json()); // Json Body parser
app.use(fileUpload()); // File or image uploading

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

// Post-middlewares
app.use(errorHandler);

// export app
module.exports = app;
