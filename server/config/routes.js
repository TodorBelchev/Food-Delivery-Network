const { Router } = require('express');

const userController = require('../controllers/userController');
const restaurantController = require('../controllers/restaurantController');

const router = Router();

router.use('/user', userController);
router.use('/restaurant', restaurantController);

module.exports = router;