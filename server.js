const express = require("express");
const morgan = require("morgan"); // third-party logger middleware
const colors = require("colors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Middlewares
// const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

// Route files
const bootcamps = require("./routes/bootcamps");

const app = express();

// Pre-middlewares
// Json Body parser
app.use(express.json());

// Dev logging middlewares
// app.use(logger); //--> using custom logger
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// routes
app.use("/api/v1/bootcamps", bootcamps);

// Post-middlewares
app.use(errorHandler);

// export app
module.exports = app;
