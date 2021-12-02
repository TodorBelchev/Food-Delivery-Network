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
    },
    rating: {
        type: Number,
        default: 0
    },
    ratingsCount: {
        type: Number,
        default: 0
    }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;