const mongoose = require('mongoose')
const { campgroundSchema } = require('../schemas')
const { Schema } = mongoose

const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String
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
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

})
const Campground = mongoose.model('Campground', CampgroundSchema)

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = Campground