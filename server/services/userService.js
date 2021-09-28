const User = require('../models/User');

const getUserByEmail = (email) => {
    return User.findOne({ email });
};

const createUser = (email, password) => {
    const user = new User({ email, password });
    return user.save();
}

module.exports = {
    getUserByEmail,
    createUser
}