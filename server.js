const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')// third-party logger middleware

// Middlewares
// const logger = require("./middleware/logger")
// Route files
const bootcamps = require('./routes/bootcamps')


// load environment variables
dotenv.config({path : './config/config.env'})

const  app = express();

// Dev logging middlewares
// app.use(logger) //--> using custom logger
if (process.env.NODE_ENV === "development"){
    app.use(morgan("dev"))
}

// routes
app.use("/api/v1/bootcamps", bootcamps)


const PORT = process.env.PORT || 5000;

app.listen( 
    PORT, 
    console.log(`Server running in ${[process.env.NODE_ENV]} mode with port ${PORT}`)
)