const User = require('../models/User');

const getUserByEmail = (email) => {
    return User.findOne({ email });
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

module.exports = {
    getUserByEmail,
    createUser,
    editUserById
}