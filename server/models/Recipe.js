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
    ingredients: [{
        type: String
    }]
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;