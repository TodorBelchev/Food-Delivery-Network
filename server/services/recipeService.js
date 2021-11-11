const Recipe = require('../models/Recipe');

const createRecipe = (data) => {
    const recipe = new Recipe(data);
    return recipe.save();
}

module.exports = {
    createRecipe
}