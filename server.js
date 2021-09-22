const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan"); // third-party logger middleware
const colors = require("colors");
const connectDB = require("./config/db");

// Middlewares
// const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

// Route files
const bootcamps = require("./routes/bootcamps");

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Connect to MongoDB
connectDB();

const app = express();

// Json Body parser
app.use(express.json());

// Dev logging middlewares
// app.use(logger); //--> using custom logger
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// routes
app.use("/api/v1/bootcamps", bootcamps);

// middlewares
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(
        `Server running in ${[process.env.NODE_ENV]} mode with port ${PORT}`
            .yellow.bold
    )
);

// Handle unhandled rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    server.close(() => process.exit(1));
});
