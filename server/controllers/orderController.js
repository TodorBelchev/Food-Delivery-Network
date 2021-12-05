const { Router } = require('express');

const { isLoggedIn, checkUser } = require('../middlewares');
const {
    createOrder,
    getActiveOrdersByRestaurantIdAndPage,
    deleteById,
    getOrderById,
    getCompletedOrdersByRestaurantId,
    getCompletedOrdersByRestaurantIdAndPage,
    getCompletedOrdersCount,
    getActiveOrdersCount
} = require('../services/orderService');
const { getMultipleById } = require('../services/recipeService');
const { getStartDate } = require('../utils');

const router = Router();

router.post('/',
    checkUser(),
    async (req, res) => {
        try {
            const address = req.body.address.trim();
            const city = req.body.city.trim();
            const name = req.body.name.trim();
            const phone = req.body.phone.trim();
            const recipes = req.body.recipes;
            const restaurant = req.body.restaurant.trim();
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
                }),
                restaurant
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

router.get('/:restaurantId/active', isLoggedIn(), async (req, res) => {
    try {
        const page = req.query.page - 1 || 0;
        const orders = await getActiveOrdersByRestaurantIdAndPage(req.params.restaurantId, page);
        const count = await getActiveOrdersCount(req.params.restaurantId);
        res.status(200).send({ orders, count });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.get('/:restaurantId/completed', isLoggedIn(), async (req, res) => {
    try {
        const page = req.query.page - 1 || 0;
        const orders = await getCompletedOrdersByRestaurantIdAndPage(req.params.restaurantId, page);
        const count = await getCompletedOrdersCount(req.params.restaurantId);
        res.status(200).send({ orders, count });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.get('/:restaurantId/categories/count', isLoggedIn(), async (req, res) => {
    try {
        const convertedDate = getStartDate(req.query.period);
        const orders = await getCompletedOrdersByRestaurantId(req.params.restaurantId, convertedDate);
        const categoriesCount = {};
        orders.forEach(x => {
            x.items.forEach(i => {
                if (categoriesCount[i.item.category]) {
                    categoriesCount[i.item.category]++;
                } else {
                    categoriesCount[i.item.category] = 1;
                }
            })
        });
        res.status(200).send(categoriesCount);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.get('/:restaurantId/sales-volumes', isLoggedIn(), async (req, res) => {
    try {
        const convertedDate = getStartDate(req.query.period);
        const orders = await getCompletedOrdersByRestaurantId(req.params.restaurantId, convertedDate);
        const sales = {};
        orders.forEach(x => {
            const orderDate = `${x.date.getDate()}/${x.date.getMonth()}/${x.date.getFullYear()}`;
            x.items.forEach(i => {
                if (sales[orderDate]) {
                    sales[orderDate] += i.price * i.quantity;
                } else {
                    sales[orderDate] = i.price * i.quantity;
                }
            });
        });
        res.status(200).send(sales);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.put('/:id', isLoggedIn(), async (req, res) => {
    try {
        const order = await getOrderById(req.params.id);
        Object.assign(order, req.body);
        await order.save();
        res.status(200).send(order);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.delete('/:id', isLoggedIn(), async (req, res) => {
    try {
        await deleteById(req.params.id);
        res.status(200).send({ message: 'Success' });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;