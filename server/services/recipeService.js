const Recipe = require('../models/Recipe');

const createRecipe = (data) => {
    const recipe = new Recipe(data);
    return recipe.save();
}

const deleteById = (id) => {
    return Recipe.findByIdAndDelete(id);
}

const getRecipeById = (id) => {
    return Recipe.findById(id);
}

module.exports = {
    createRecipe,
    deleteById,
    getRecipeById
}