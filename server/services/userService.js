const User = require('../models/User');

const getUserByEmail = (email) => {
    return User.findOne({ email });
};

module.exports = {
    getUserByEmail
}