const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
const fs = require("fs");

//read env variables
dotenv.config({ path: "./config/config.env" });

// models
const Bootcamp = require("./models/Bootcamp");

// read json data
const bootcampData = JSON.parse(
    fs.readFileSync(`${__dirname}/data/bootcamps.json`, "utf-8")
);
console.log(process.env.GEOCODER_PROVIDER);
// connect to database
let conn = mongoose.connect(process.env.MONGO_URI, {});

// function to add bootcamp data in database
const addData = async () => {
    try {
        await Bootcamp.create(bootcampData);
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
