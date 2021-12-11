const Restaurant = require('../models/Restaurant');


const createRestaurant = (data) => {
    const restaurant = new Restaurant(data);
    return restaurant.save();
}

const getByOwnerId = (owner, page, sort) => {
    return Restaurant.find({ owner }).sort(sort).skip(page * 16).limit(16).populate('recipes').lean();
}

const getById = (id) => {
    return Restaurant.findById(id).populate('recipes');
}

const deleteById = (id) => {
    return Restaurant.findByIdAndDelete(id);
}

const getRestaurants = (filter, page, sort) => {
    return Restaurant.find(filter).sort(sort).skip(page * 16).limit(16).lean();
}

const getCount = (filter) => {
    return Restaurant.countDocuments(filter);
}

const getFavorites = (favorites, page, sort) => {
    return Restaurant.find({ _id: { $in: favorites } }).sort(sort).skip(page * 16).limit(16).lean();
}

module.exports = {
    createRestaurant,
    getByOwnerId,
    getById,
    deleteById,
    getRestaurants,
    getCount,
    getFavorites
}