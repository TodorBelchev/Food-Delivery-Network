const jwt = require('jsonwebtoken');

const { COOKIE_NAME, SECRET } = require('../config');
const { createToken } = require('../utils/jwt');

module.exports = () => (req, res, next) => {
    const token = req.cookies[COOKIE_NAME];
    try {
        const decoded = jwt.verify(token, SECRET);
        res.cookie(COOKIE_NAME, createToken({ id: decoded.id }), { httpOnly: true });
        req.decoded = decoded;
        next();
    } catch (error) {
        res.clearCookie(COOKIE_NAME);
        res.status(401).send({ message: 'Please log in' });
    }

}