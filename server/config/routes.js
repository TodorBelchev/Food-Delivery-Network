const { Router } = require('express');

const userController = require('../controllers/userController');
const restaurantController = require('../controllers/restaurantController');
const recipeController = require('../controllers/recipeController');

const router = Router();

router.use('/user', userController);
router.use('/restaurant', restaurantController);
router.use('/recipe', recipeController);

module.exports = router;