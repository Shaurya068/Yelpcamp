const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const { campgroundSchema, reviewSchema } = require('../schemas.js')
const { isLoggedIn } = require('../middleware.js')
const { isAuthor } = require('../middleware.js')
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next()
    }
}

router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
            model: 'User'
        }
    }).populate('author')
    console.log(campground)

    if (!campground) {
        req.flash('error', 'cannot find a campground')
        return res.redirect('/campground')
    }
    res.render('campgrounds/show', { campground })
}))
router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {

    res.render('campgrounds/edit')
}))
router.post('/', validateCampground, isLoggedIn, isAuthor, wrapAsync(async (req, res, next) => {
    // if (!req.body.campground) { throw new ExpressError(400, 'Invalid Id') }
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Successfully created a campground')
    res.redirect(`/campground/${campground._id}`)
}))

router.put('/:id', validateCampground, isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params


    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { new: true })
    req.flash('success', 'Successfully updated a campground')
    res.redirect(`/campground/${id}`)
}))


router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a campground')
    res.redirect('/campground')
}))
module.exports = router