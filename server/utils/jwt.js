const jwt = require('jsonwebtoken');

const { SECRET } = require('../config');

const createToken = (data) => {
    const token = jwt.sign(data, SECRET, { expiresIn: '30m' });
    return token;
}

module.exports = {
    createToken
}