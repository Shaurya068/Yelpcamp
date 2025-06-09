const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const User = require('../models/user'); // <- Add this
const cities = require('./cities');
const { places, descriptors } = require('./places');

const db_url = process.env.DB_URL || 'your fallback local URI';
mongoose.connect('mongodb+srv://shaurya-new-user:1uDLsaZZmHUYSxOk@cluster0.hxbyifp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('DB connected!'))
  .catch(err => console.log(err));

const seedDb = async () => {
  await Campground.deleteMany({});
  await User.deleteMany({});

  // 1. Create a dummy user
  const user = new User({ username: 'shaurya', email: 'shaurya@example.com' });
  user.setPassword ? user.setPassword('123456') : user.password = '123456'; // depends on your User model
  await user.save();

  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;

    const camp = new Campground({
      author: user._id, // ✅ use created user's ID
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: {
        type: 'Point',
        coordinates: [cities[random1000].longitude, cities[random1000].latitude]
      },
      title: `${places[Math.floor(Math.random() * places.length)]} - ${descriptors[Math.floor(Math.random() * descriptors.length)]}`,
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
      price
    });

    await camp.save();
  }
};

seedDb().then(() => mongoose.connection.close());
