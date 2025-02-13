const express = require('express')
const path = require('path')
const session = require('express-session')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const ejsMate = require('ejs-mate')
const app = express()
const flash = require('connect-flash');
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const campgrounds = require('./routes/campground.js')
const reviews = require('./routes/review.js')
const User = require('./models/user.js')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const users = require('./routes/users.js')
mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp').then(() => console.log('Up and running!!!')).catch(err => console.log(err));
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


app.use('/', users)
app.get('/', (req, res) => {
    res.render('home')
})
app.use('/campground', campgrounds)

app.engine('ejs', ejsMate)
app.get('/makeCampground', async (req, res) => {
    const camp = new Campground({ title: 'new', })
    await camp.save()
    res.send(camp)
})

//review
app.use('/campground/:id/reviews', reviews)
app.use('/', users)
app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError(404, 'Page not found'))
})
//this code catches error and returns the status
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) { err.message = 'Oh no Something went wrong' }
    res.status(status).render('campgrounds/error', { err })
})

app.listen('4000', () => {
    console.log('LISTENING TO PORT 4000')
})
