const Order = require('../models/Order');

const createOrder = (data) => {
    const order = new Order(data);
    return order.save();
};

module.exports = {
    createOrder
}