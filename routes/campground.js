const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const { isLoggedIn } = require('../middleware.js')
const { isAuthor } = require('../middleware.js')
const campgrounds = require('../controllers/campgrounds.js')
const { validateCampground } = require('../middleware.js')
const multer = require('multer')
const { storage } = require('../cloudinary/app.js')
const upload = multer({ storage })

router.route('/').get(wrapAsync(campgrounds.index))
router.route('/').get(wrapAsync(campgrounds.index)).post(isLoggedIn, upload.array('images', 5), validateCampground, wrapAsync(campgrounds.createForm))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id').get(wrapAsync(campgrounds.show)).put(isLoggedIn, isAuthor, upload.array('images', 5), wrapAsync(campgrounds.updatePage)).delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deletePage))
router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.edit))

module.exports = router