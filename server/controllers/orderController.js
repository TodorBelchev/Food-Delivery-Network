const { Router } = require('express');

const { checkUser } = require('../middlewares');
const { createOrder } = require('../services/orderService');
const { getMultipleById } = require('../services/recipeService');

const router = Router();

router.post('/', checkUser(), async (req, res) => {
    try {
        const address = req.body.address.trim();
        const city = req.body.city.trim();
        const name = req.body.name.trim();
        const phone = req.body.phone.trim();
        const recipes = req.body.recipes;
        if (address.length < 6) {
            throw new Error('Address must be at least 6 characters long!');
        }
        if (city.length < 4) {
            throw new Error('City must be at least 4 characters long!');
        }
        if (name.length < 6) {
            throw new Error('Name must be at least 6 characters long!');
        }
        if (!phone.match(/^(\+359|0)\d{9}$/)) {
            throw new Error('Please enter a valid phone number!');
        }
        if (recipes.length < 1) {
            throw new Error('No ordered items!');
        }

        const recipesDB = await getMultipleById(recipes);

        const orderData = {
            name,
            phone,
            city,
            address,
            items: recipes.map(x => {
                const price = recipesDB.find(y => y._id.toString() === x.recipe).price;
                return Object.assign({}, { item: x.recipe, quantity: x.quantity, price });
            })
        };


        if (req.decoded) {
            orderData.user = req.decoded.id;
        }

        const order = await createOrder(orderData);
        res.status(200).send(order);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;