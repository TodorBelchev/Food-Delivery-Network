const { Router } = require('express');

const userController = require('../controllers/userController');
const restaurantController = require('../controllers/restaurantController');
const recipeController = require('../controllers/recipeController');
const orderController = require('../controllers/orderController');

const router = Router();

router.use('/user', userController);
router.use('/restaurant', restaurantController);
router.use('/recipe', recipeController);
router.use('/order', orderController);

module.exports = router;