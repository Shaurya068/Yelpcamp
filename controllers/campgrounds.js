const Campground = require('../models/campground')
const cloudinary = require('cloudinary')
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    const geoJSON = {
        type: 'FeatureCollection',
        features: campgrounds.map(campground => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: campground.geometry.coordinates
            },
            properties: {
                popUpMarkup: `
                    <strong><a href="/campground/${campground._id}">${campground.title}</a></strong>
                    <p>${campground.description.substring(0, 20)}...</p>
                `
            }
        }))
    };
    res.render('campgrounds/index', { campgrounds, geoJSON });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
            model: 'User'
        }
    }).populate('author')

    if (!campground) {
        req.flash('error', 'cannot find a campground')
        return res.redirect('/campground')
    }
    res.render('campgrounds/show', { campground })
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
    console.log(req.body)
    res.render('campgrounds/edit', { camp })
}

module.exports.deletePage = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a campground')
    res.redirect('/campground')
}

module.exports.updatePage = async (req, res) => {
    const { id } = req.params
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { new: true })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs)
    campground.geometry = geoData.features[0].geometry;
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }

    req.flash('success', 'Successfully updated a campground')
    res.redirect(`/campground/${id}`)
}

module.exports.createForm = async (req, res, next) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });


    if (!req.files || req.files.length === 0) {
        req.flash("error", "No images uploaded!");
        return res.redirect("/campgrounds/new");
    }

    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;

    await campground.save();
    req.flash("success", "Successfully created a campground!");
    res.redirect(`/campground/${campground._id}`);
};
