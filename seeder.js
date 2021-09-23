const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
const fs = require("fs");

//read env variables
dotenv.config({ path: "./config/config.env" });

// models
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");

// read json data
const bootcampData = JSON.parse(
    fs.readFileSync(`${__dirname}/data/bootcamps.json`, "utf-8")
);
const courseData = JSON.parse(
    fs.readFileSync(`${__dirname}/data/courses.json`, "utf-8")
);

// connect to database
let conn = mongoose.connect(process.env.MONGO_URI, {});

// function to add bootcamp data in database
const addData = async () => {
    try {
        await Bootcamp.create(bootcampData);
        await Course.create(courseData);
        console.log("Data Imported...".green.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

// function to delete all bootcamp data in database

const removeData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log("Data deleted...".green.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
};

if (process.argv[2] === "-i") {
    addData();
} else if (process.argv[2] === "-d") {
    removeData();
}
