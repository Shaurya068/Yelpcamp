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
    for (let i = 0; i < 300; i++) {

        const random1000 = (Math.floor(Math.random() * 1000))
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '678ea96bce05dda991e250f3',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            title: `${places[Math.floor(Math.random() * places.length)] + '-' + descriptors[Math.floor(Math.random() * descriptors.length)]}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dq3f158ss/image/upload/v1742327968/YelpCamp/xznkuldib6h4x80pirg6.jpg',
                    filename: 'YelpCamp/xznkuldib6h4x80pirg6',

                },
                {
                    url: 'https://res.cloudinary.com/dq3f158ss/image/upload/v1742327968/YelpCamp/zfq9khbyabuofypy4oaa.jpg',
                    filename: 'YelpCamp/zfq9khbyabuofypy4oaa',

                },
                {
                    url: 'https://res.cloudinary.com/dq3f158ss/image/upload/v1742327984/YelpCamp/lswua3o8ouz6iexuptoc.jpg',
                    filename: 'YelpCamp/lswua3o8ouz6iexuptoc',

                }
            ],
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus, eius molestias. Enim quae eius, earum veniam incidunt non delectu',
            price: price,
        })
        await camp.save()
    }
}
seedDb().then(() => { mongoose.connection.close });
