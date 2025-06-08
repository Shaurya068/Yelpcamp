const mongoose = require('mongoose')
const { campgroundSchema } = require('../schemas')
const { required } = require('joi')
const { Schema } = mongoose
const Review = require('./review')

const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})
const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } };
const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: ['Number'],
            required: true
        }
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],


}, opts)
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href="/campground/${this._id}">${this.title}</a>`
})
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
const Campground = mongoose.model('Campground', CampgroundSchema)

module.exports = Campground