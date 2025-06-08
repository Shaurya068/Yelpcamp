const Review = require('./models/review')
const Campground = require('./models/campground')
const { reviewSchema } = require('./schemas')
const { campgroundSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressError')
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.originalPath = req.originalUrl
        req.flash('error', 'you must be signed in first')
        return res.redirect('/login')
    }
    next()
}
module.exports.storeRequiredPath = (req, res, next) => {
    if (req.session.originalPath) {
        res.locals.originalPath = req.session.originalPath
        console.log(res.locals.originalPath)
    }
    next();
}
module.exports.isAuthor = async (req, res, next) => {
    console.log(req.params)
    console.log(req.user)
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do this task')
        return res.redirect(`/campground/${id}`)
    }
    next();
}
module.exports.reviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId); // Fixed typo

    if (!review) {
        req.flash('error', 'Review not found');
        return res.redirect(`/campground/${id}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do this task');
        return res.redirect(`/campground/${id}`);
    }

    next();
};
module.exports.validateCampground = (req, res, next) => {
    console.log("Request Body:", req.body); // Debugging
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next()
    }
}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)

    } else {
        next()
    }
}

