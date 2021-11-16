const { Router, response } = require('express');
const formidable = require('formidable');

const { getById } = require('../services/restaurantService');
const { createRecipe, deleteById } = require('../services/recipeService');
const { getFormData, uploadToCloudinary } = require('../utils');

const { checkUser } = require('../middlewares');

const router = Router();

router.post('/:RestaurantId/add-recipe', checkUser(), async (req, res) => {
    const form = formidable({ multiples: true });
    const imagesURL = [];
    try {
        const [formData, incFiles] = await getFormData(req, form);

        for (const file of Object.values(incFiles)) {
            const res = await uploadToCloudinary(file.path);
            imagesURL.push({ url: res.url, public_id: res.public_id });
        }

        formData.images = imagesURL;
        if (formData.images.length == 0) {
            throw new Error('At least one image is required!');
        }
        const name = formData.name.trim();
        const ingredients = formData.ingredients.split(',').map(x => x.trim());
        const category = formData.category.trim();
        const price = Number(formData.price.trim());
        const weight = Number(formData.weight.trim());

        if (name.length < 6) {
            throw new Error('Recipe name must be at least 6 characters long!');
        }

        if (ingredients.length < 3) {
            throw new Error('Recipe ingredients must be at last 3!')
        }

        if (!price) {
            throw new Error('Price is required!');
        }

        if (!weight) {
            throw new Error('Weight is required!');
        }

        if (!category) {
            throw new Error('Category is required!');
        }

        const restaurant = await getById(req.params.RestaurantId);
        const recipe = await createRecipe({
            name,
            ingredients,
            price,
            category,
            weight,
            image: imagesURL[0]
        });
        restaurant.recipes.push(recipe);
        await recipe.save();
        await restaurant.save();
        res.status(200).send(restaurant);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.delete('/:id/:restaurantId', checkUser(), async (req, res) => {
    try {
        const restaurant = await getById(req.params.restaurantId);
        await deleteById(req.params.id);
        restaurant.recipes = restaurant.recipes.filter(recipe => recipe._id.toString() !== req.params.id);
        await restaurant.save();
        res.status(200).send(restaurant);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;