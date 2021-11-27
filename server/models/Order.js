const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String
    },
    phone: {
        type: Number
    },
    city: {
        type: String
    },
    address: {
        type: String
    },
    items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        },
        quantity: {
            type: Number
        },
        price: {
            type: Number
        }
    }],
    status: {
        type: String,
        default: 'pending'
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;