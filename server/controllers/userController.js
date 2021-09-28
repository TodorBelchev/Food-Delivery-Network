const { Router } = require('express');

const { SALT_ROUNDS, COOKIE_NAME } = require('../config');
const { getUserByEmail } = require('../services/userService');
const { removePass, createToken } = require('../utils');
const { isEmail } = require('../validators');

const router = Router();

router.post('/login', async (req, res) => {
	const email = req.body.email.trim();
	const password = req.body.password.trim();

	try {
		if (!isEmail(email)) {
			throw new Error('Invalid email!');
		}

		if (password.length < 6) {
			throw new Error('Password must be at least 6 characters long!');
		}

		const user = await getUserByEmail(email);
		if (!user) {
			throw new Error('Invalid email or password!');
		}

		const payload = removePass(user);
		const token = createToken({ id: user._id });
		res.cookie(COOKIE_NAME, token, { httpOnly: true });
		res.status(200).send(payload);
	} catch (error) {
		console.log(error);
		res.status(400).send({ message: error.message });
	}
});

router.post('/register', (req, res) => {
	res.status(200).send({ email: 'pesho@abv.bg' });
});

module.exports = router;