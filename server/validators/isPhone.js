const isPhone = (value) => value.match(/^(\+359|0)\d{9}$/);

module.exports = isPhone;