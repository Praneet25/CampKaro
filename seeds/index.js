const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const {
    places,
    descriptors
} = require('./seedhelpers')
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/camp-karo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('database connected')
});

const sample = arr => arr[Math.floor(Math.random() * arr.length)];


const seedDB = async function () {
    await Campground.deleteMany({});
    for (let i = 0; i < 150; i++) {
        const randNum = Math.floor(Math.random() * 177)
        const city = cities[randNum].city
        const price = Math.floor(Math.random() * 20) + 10
        const state = cities[randNum].state;
        const campground = new Campground({
            author: "60ff978b61757f133c5eb9ce",
            location: `${city} ,${state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [{
                    url: 'https://res.cloudinary.com/dggtsld4t/image/upload/v1627464219/CampKaro/opsfklxvys924yhogpk0.jpg',
                    filename: 'CampKaro/opsfklxvys924yhogpk0'
                },
                {
                    url: 'https://res.cloudinary.com/dggtsld4t/image/upload/v1627464221/CampKaro/yqhfg6tjh3hzdt6k2vic.jpg',
                    filename: 'CampKaro/yqhfg6tjh3hzdt6k2vic'
                }
            ],
            geometry: {
                coordinates: [cities[randNum].lng, cities[randNum].lat],
                type: 'Point'
            },

            price,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate unde tempore qui ex beatae, officia ab, ea cumque harum aliquam iure commodi nihil facere quaerat corporis vero ut, accusantium excepturi.'
        })
        await campground.save()

    }


};

seedDB()