const mongoose = require('mongoose');
const { Schema } = mongoose
const reviewSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    rating: Number,
    campground: {
        type: Schema.Types.ObjectId,
        ref: 'Campground'
    }
})
const Review = mongoose.model("Review", reviewSchema)
module.exports = Review