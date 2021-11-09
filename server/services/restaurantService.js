const Restaurant = require('../models/Restaurant');


const createRestaurant = (data) => {
    const restaurant = new Restaurant(data);
    return restaurant.save();
}

const getByOwnerId = (owner) => {
    return Restaurant.find({ owner });
}

const getById = (id) => {
    return Restaurant.findById(id);
}

module.exports = {
    createRestaurant,
    getByOwnerId,
    getById
}