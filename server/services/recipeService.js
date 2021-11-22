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

const getMultipleById = (ids) => {
    const promises = [];
    ids.forEach(x => {
        promises.push(Recipe.findById(x.recipe));
    });

    return Promise.all(promises);
}

module.exports = {
    createRecipe,
    deleteById,
    getRecipeById,
    getMultipleById
}