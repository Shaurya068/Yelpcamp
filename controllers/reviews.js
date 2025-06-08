const Campground = require('../models/campground')
const Review = require('../models/review.js')
module.exports.makeReview = async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    camp.reviews.push(review)
    await review.save()
    await camp.save()
    req.flash('success', 'Successfully created a review')
    res.redirect(`/campground/${camp._id}`);
}


module.exports.deleteReviews = async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove the review reference from the campground
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review document itself
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Successfully deleted the review');
    res.redirect(`/campground/${id}`);
};
