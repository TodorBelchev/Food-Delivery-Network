const removePass = (user) => {
    return {
        email: user.email,
        _id: user._id,
        isAdmin: user.isAdmin,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        city: user.city,
        location: user.location
    }
}

module.exports = {
    removePass
};