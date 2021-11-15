const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String
    },
    price: {
        type: Number
    },
    category: {
        type: String
    },
    weight: {
        type: Number
    },
    ingredients: [{
        type: String
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
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;