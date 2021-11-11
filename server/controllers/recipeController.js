const { Router } = require('express');

const { getById } = require('../services/restaurantService');
const { createRecipe } = require('../services/recipeService');

const { checkUser } = require('../middlewares');

const router = Router();

router.post('/:RestaurantId/add-recipe', checkUser(), async (req, res) => {
    try {
        const name = req.body.name.trim();
        const ingredients = req.body.ingredients.split(',').map(x => x.trim());
        const price = Number(req.body.price.trim());
        const category = req.body.category.trim();

        if (name.length < 6) {
            throw new Error('Recipe name must be at least 6 characters long!');
        }

        if (ingredients.length < 3) {
            throw new Error('Recipe ingredients must be at last 3!')
        }

        if (!price) {
            throw new Error('Price is required!');
        }

        if (!category) {
            throw new Error('Category is required!');
        }

        const restaurant = await getById(req.params.RestaurantId);
        const recipe = await createRecipe({
            name,
            ingredients,
            price,
            category
        });
        restaurant.recipes.push(recipe);
        await recipe.save();
        await restaurant.save();
        res.status(200).send(recipe);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;