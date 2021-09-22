const app = require("./server");
const colors = require("colors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Connect to MongoDB
connectDB();

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
