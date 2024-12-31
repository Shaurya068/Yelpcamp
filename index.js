const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const ejsMate = require('ejs-mate')
const app = express();
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const wrapAsync = require('./utils/wrapAsync')
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const Review = require('./models/review.js')

mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp').then(() => console.log('Up and running!!!')).catch(err => console.log(err));


app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next()
    }
}
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)

    } else {
        next()
    }
}
app.get('/', (req, res) => {
    res.render('home')
})
app.get('/campground', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})
app.engine('ejs', ejsMate)
app.get('/campground/new', (req, res) => {
    res.render('campgrounds/new')
})
app.post('/campground', validateCampground, wrapAsync(async (req, res, next) => {
    // if (!req.body.campground) { throw new ExpressError(400, 'Invalid Id') }

    const campground = await Campground.insertMany(req.body.campground)
    await campground.save()
    res.redirect('/campground')

}))
app.get('/campground/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews')
    console.log(campground)
    res.render('campgrounds/show', { campground })
}))
app.put('/campground/:id', validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findByIdAndUpdate(id, req.body.campground, { new: true })
    res.redirect(`/campground/${id}`)
}))
app.get('/campground/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    res.render('campgrounds/edit', { camp })
}))
app.get('/makeCampground', async (resq, res) => {
    const camp = new Campground({ title: 'new', })
    await camp.save()
    res.send(camp)
})
app.delete('/campground/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findByIdAndDelete(id)
    res.redirect('/campground')
}))

//review
app.post('/campground/:id/reviews', validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    const review = new Review(req.body.review)
    camp.reviews.push(review)
    await review.save()
    await camp.save()
    res.redirect(`/campground/${camp._id}`);
}))
app.delete('/campground/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campground/${id}`)
}))
app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError(404, 'Page not found'))
})
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) { err.message = 'Oh no Something went wrong' }
    res.status(status).render('campgrounds/error', { err })
})

app.listen('4000', () => {
    console.log('LISTENING TO PORT 4000')
})
