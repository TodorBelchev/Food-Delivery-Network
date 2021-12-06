const Order = require('../models/Order');

const createOrder = (data) => {
    const order = new Order(data);
    return order.save();
};

const getOrderById = (id) => {
    return Order.findById(id).populate('items.item').populate('restaurant');
};

const getMyOrders = (id, page) => {
    return Order.find({ user: id }).sort({ date: 'desc' }).skip(page * 20).limit(20).populate('items.item').populate('restaurant');
};

const getMyOrdersCount = (id) => {
    return Order.countDocuments({ user: id });
};

const getActiveOrdersByRestaurantIdAndPage = (id, page) => {
    return Order.find({ restaurant: id, status: 'pending' }).skip(page * 20).limit(20).populate('items.item').populate('restaurant');
};

const getCompletedOrdersByRestaurantId = (id, startDate = 0) => {
    return Order.find({ restaurant: id, status: 'completed', date: { $gte: startDate } }).populate('items.item').populate('restaurant');
};

const getCompletedOrdersByRestaurantIdAndPage = (id, page) => {
    return Order.find({ restaurant: id, status: 'completed' }).sort({ date: 'desc' }).skip(page * 20).limit(20).populate('items.item').populate('restaurant');
};

const deleteById = (id) => {
    return Order.findByIdAndDelete(id);
};

const getActiveOrdersCount = (id) => {
    return Order.countDocuments({ restaurant: id, status: 'pending' });
};

const getCompletedOrdersCount = (id) => {
    return Order.countDocuments({ restaurant: id, status: 'completed' });
};

module.exports = {
    createOrder,
    getActiveOrdersByRestaurantIdAndPage,
    getCompletedOrdersByRestaurantId,
    getCompletedOrdersByRestaurantIdAndPage,
    deleteById,
    getOrderById,
    getActiveOrdersCount,
    getCompletedOrdersCount,
    getMyOrders,
    getMyOrdersCount
}