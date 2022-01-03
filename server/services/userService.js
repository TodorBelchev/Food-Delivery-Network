const User = require('../models/User');

const getUserByEmail = (email) => {
    return User.findOne({ email });
};

const getUserById = (id) => {
    return User.findById(id);
};

const editUserById = async (id, body) => {
    try {
        const user = await User.findById(id);
        Object.assign(user, body);
        return user.save();
    } catch (error) {
        throw new Error(error)
    }
};

const createUser = (email, password) => {
    const user = new User({ email, password });
    return user.save();
};

const userService = {
    getUserByEmail,
    createUser,
    editUserById,
    getUserById
}

module.exports = userService;