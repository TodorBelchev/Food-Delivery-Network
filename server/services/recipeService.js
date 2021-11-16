const Recipe = require('../models/Recipe');

const createRecipe = (data) => {
    const recipe = new Recipe(data);
    return recipe.save();
}

const deleteById = (id) => {
    return Recipe.findByIdAndDelete(id);
}

module.exports = {
    createRecipe,
    deleteById
}