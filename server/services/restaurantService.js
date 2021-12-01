const Restaurant = require('../models/Restaurant');


const createRestaurant = (data) => {
    const restaurant = new Restaurant(data);
    return restaurant.save();
}

const getByOwnerId = (owner) => {
    return Restaurant.find({ owner }).populate('recipes').lean();
}

const getById = (id) => {
    return Restaurant.findById(id).populate('recipes');
}

const deleteById = (id) => {
    return Restaurant.findByIdAndDelete(id);
}

const getRestaurants = (filter) => {
    return Restaurant.find(filter).lean();
}

module.exports = {
    createRestaurant,
    getByOwnerId,
    getById,
    deleteById,
    getRestaurants
}