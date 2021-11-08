const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String
    },
    mainTheme: {
        type: String,
    },
    categories: [{
        type: String
    }],
    workHours: [{
        type: String
    }],
    workDays: [{
        type: String
    }],
    cities: [{
        type: String,
    }],
    image: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;