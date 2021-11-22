const removePass = (user) => {
    return {
        email: user.email,
        _id: user._id,
        isAdmin: user.isAdmin,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        city: user.city,
        address: user.address
    }
}

module.exports = {
    removePass
};