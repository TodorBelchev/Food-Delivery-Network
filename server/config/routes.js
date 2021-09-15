const { Router } = require('express');

const userController = require('../controllers/userController');

const router = Router();

router.use('/user', userController);

module.exports = router;