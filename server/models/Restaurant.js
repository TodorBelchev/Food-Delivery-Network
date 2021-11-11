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
        _id: {
            type: Number
        },
        name: {
            type: String
        }
    }],
    image: {
        type: {
            url: {
                type: String
            },
            public_id: {
                type: String
            }
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    recipes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }],
        default: []
    }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;