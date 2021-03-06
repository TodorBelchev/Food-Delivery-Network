const { Router } = require('express');
const formidable = require('formidable');

const { getById } = require('../services/restaurantService');
const { createRecipe, deleteById, getRecipeById } = require('../services/recipeService');
const { getFormData, uploadToCloudinary, deleteFromCloudinary } = require('../utils');

const { isLoggedIn, isOwner } = require('../middlewares');

const router = Router();

router.post('/:restaurantId/add-recipe', isLoggedIn(), isOwner(), async (req, res) => {
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

        if (name.length < 5) {
            throw new Error('Recipe name must be at least 5 characters long!');
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

        const restaurant = await getById(req.params.restaurantId);
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

router.put('/:id/:restaurantId', isLoggedIn(), isOwner(), async (req, res) => {
    try {
        const form = formidable({ multiples: true });
        const imagesURL = [];
        const recipe = await getRecipeById(req.params.id);
        const [formData, incFiles] = await getFormData(req, form);

        if (Object.keys(incFiles).length == 0) {
            throw new Error('At least one image is required!');
        }
        
        if (Object.keys(incFiles).length > 0) {
            for (const file of Object.values(incFiles)) {
                const res = await uploadToCloudinary(file.path);
                imagesURL.push({ url: res.url, public_id: res.public_id });
            }

            formData.images = imagesURL;
           
            await deleteFromCloudinary(recipe.image.public_id);
        }

        const recipeData = {
            name: formData.name.trim(),
            price: formData.price.trim(),
            category: formData.category.trim(),
            weight: formData.weight.trim(),
            ingredients: formData.ingredients.split(',').map(x => x.trim()),
            image: imagesURL[0] || recipe.image
        };

        if (recipeData.name.length < 5) {
            throw new Error('Recipe name must be at least 5 characters long!');
        }

        if (recipeData.ingredients.length < 3) {
            throw new Error('Recipe ingredients must be at last 3!')
        }

        if (!recipeData.price) {
            throw new Error('Price is required!');
        }

        if (!recipeData.weight) {
            throw new Error('Weight is required!');
        }

        if (!recipeData.category) {
            throw new Error('Category is required!');
        }

        Object.assign(recipe, recipeData);
        await recipe.save();
        const restaurant = await getById(req.params.restaurantId);
        res.status(200).send(restaurant);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.delete('/:id/:restaurantId', isLoggedIn(), isOwner(), async (req, res) => {
    try {
        const restaurant = await getById(req.params.restaurantId);
        await deleteById(req.params.id);
        const recipe = restaurant.recipes.find(x => x._id.toString() === req.params.id);
        await deleteFromCloudinary(recipe.image.public_id);
        restaurant.recipes = restaurant.recipes.filter(recipe => recipe._id.toString() !== req.params.id);
        await restaurant.save();
        res.status(200).send(restaurant);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;