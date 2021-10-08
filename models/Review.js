const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        maxlength: [50, "Title cannot be more than 5 0 characters"],
        required: [true, "Please add a title"],
    },
    text: {
        type: String,
        required: [true, "Please add a message"],
    },
    rating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [10, "Rating must can not be more than 10"],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: "Bootcamp",
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
});

ReviewSchema.statics.getAverageRating = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId },
        },
        {
            $group: {
                _id: "$bootcamp",
                averageRating: { $avg: "$rating" },
            },
        },
    ]);

    try {
        await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating,
        });
    } catch (error) {
        console.error(error);
    }
};

// Call a method getAverageRating after save
ReviewSchema.post("save", async function () {
    console.log("Review saved");
    this.constructor.getAverageRating(this.bootcamp);
});

// Update doest not recalculate ratings
// ReviewSchema.post("updateOne", async function (next) {
//     console.log("Review updated");
//     console.log(this);
// });

// Call a method getAverageRating before remove
ReviewSchema.pre("remove", async function () {
    this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model("Review", ReviewSchema);
