const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const app = express()
const { places, descriptors } = require('./places')

mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp').then(() => console.log('Up and running!!!')).catch(err => console.log(err));
const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = (Math.floor(Math.random() * 1000))
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${places[Math.floor(Math.random() * places.length)] + '-' + descriptors[Math.floor(Math.random() * descriptors.length)]}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus, eius molestias. Enim quae eius, earum veniam incidunt non delectu',
            price: price,
        })
        await camp.save()
    }
}
seedDb().then(() => { mongoose.connection.close });
