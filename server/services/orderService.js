const Order = require('../models/Order');

const createOrder = (data) => {
    const order = new Order(data);
    return order.save();
};

const getOrderById = (id) => {
    return Order.findById(id).populate('items.item').populate('restaurant');
}

const getActiveOrdersByRestaurantId = (id) => {
    return Order.find({ restaurant: id, status: 'pending' }).populate('items.item').populate('restaurant');
};

const getCompletedOrdersByRestaurantId = (id, startDate = 0) => {
    return Order.find({ restaurant: id, status: 'completed', date: { $gte: startDate } }).populate('items.item').populate('restaurant');
};

const deleteById = (id) => {
    return Order.findByIdAndDelete(id);
};

module.exports = {
    createOrder,
    getActiveOrdersByRestaurantId,
    getCompletedOrdersByRestaurantId,
    deleteById,
    getOrderById
}