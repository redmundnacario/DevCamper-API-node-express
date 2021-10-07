const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
// const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email",
        ],
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: [6, "Password minimum length is 6 characters"],
        select: false,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "publisher"],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

//
// UserSchema.plugin(uniqueValidator);
// UserSchema.post("save", function (error, doc, next) {
//     if (error.name === "MongoError" && error.code === 11000) {
//         next(new ErrorResponse("Email must be unique."));
//     } else {
//         next(error);
//     }
// });

// Encrypting password
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// assign jwt
UserSchema.methods.getSignedJwToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

//Match input password with encrypted password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method: Generate Reset password token
UserSchema.methods.getResetPasswordToken = function (res, req, next) {
    // generate a token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hash token and set to resetPasswordTokenField
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Set expire -> in milliseconds- if you want 10 mins ,then 10 * 60 * 1000
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
