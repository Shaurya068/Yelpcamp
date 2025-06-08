const User = require('../models/user')
module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}
module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        const newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password)
        req.login(registeredUser, err => {
            if (err) {
                return next(err)
            }
            req.flash('success', 'Welcome to YelpCamp')
            res.redirect('/campground')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}
module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}
module.exports.loginUser = (req, res) => {
    const redirectUrl = res.locals.originalPath || '/campground';

    req.flash('success', 'Welcome Back!!!!')
    res.redirect(redirectUrl)
}
module.exports.logoutUser = (req, res) => {

    req.logout(function (err) {
        if (err) {
            return next(err)
        } else {
            req.flash('success', 'Goodbye')
            res.redirect('/campground')
        }
    })
}