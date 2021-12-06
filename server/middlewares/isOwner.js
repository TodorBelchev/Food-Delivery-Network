const { getById } = require('../services/restaurantService');

module.exports = () => async (req, res, next) => {
    try {
        const restaurant = await getById(req.params.restaurantId);
        if (restaurant.owner.toString()  !== req.decoded.id) {
            throw new Error('Not authorized!');
        }
        next();
    } catch (error) {
        res.status(401).send({ message: 'Not authorized' });
    }
}