const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const wrapAsync = require('../utils/wrapAsync')
const { storeRequiredPath } = require('../middleware')


router.get('/register', (req, res) => {
    res.render('users/register')
})


router.post('/register', wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body
        const newUser = new User({ email, username })
        console.log(newUser)
        const registeredUser = await User.register(newUser, password)
        req.login(registeredUser, err => {
            if (err) {
                next(err)
            } else {
                req.flash('success', 'Welcome to YelpCamp')
                res.redirect('/campground')
            }
        })

    } catch (e) {
        req.flash('error', 'Something went wrong')
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})
router.post('/login', storeRequiredPath, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    const redirectUrl = res.locals.originalPath || '/campground';
    console.log(redirectUrl)
    req.flash('success', 'Welcome Back!!!!')
    res.redirect(redirectUrl)
})
router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        } else {
            req.flash('success', 'Goodbye')
            res.redirect('/campground')
        }
    })
})

module.exports = router