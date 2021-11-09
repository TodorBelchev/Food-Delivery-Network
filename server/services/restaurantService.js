const Restaurant = require('../models/Restaurant');


const createRestaurant = (data) => {
    const restaurant = new Restaurant(data);
    return restaurant.save();
}

const getByOwnerId = (owner) => {
    return Restaurant.find({ owner });
}

module.exports = {
    createRestaurant,
    getByOwnerId
}