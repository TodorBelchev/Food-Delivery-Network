const { Router } = require('express');
const bcrypt = require('bcrypt');

const { SALT_ROUNDS, COOKIE_NAME } = require('../config');
const { getUserByEmail, createUser } = require('../services/userService');
const { removePass, createToken } = require('../utils');
const { isEmail } = require('../validators');

const router = Router();

router.post('/login', async (req, res) => {
	try {
		const email = req.body.email.trim();
		const password = req.body.password.trim();

		if (!isEmail(email)) {
			throw new Error('Invalid email!');
		}

		if (password.length < 6) {
			throw new Error('Password must be at least 6 characters long!');
		}

		const user = await getUserByEmail(email);

		if (!user) {
			throw new Error('Invalid credentials!');
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			throw new Error('Invalid credentials!');
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

router.post('/register', async (req, res) => {
	try {
		const email = req.body.email.trim();
		const password = req.body.password.trim();
		const rePassword = req.body.rePassword.trim();

		if (!isEmail(email)) {
			throw new Error('Invalid email!');
		}

		if (password.length < 6) {
			throw new Error('Password must be at least 6 characters long!');
		}

		if (password !== rePassword) {
			throw new Error('Passwords must match!');
		}

		let user = await getUserByEmail(email);

		if (user) {
			throw new Error('Email already registered!');
		}

		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
		user = await createUser(email, hashedPassword);
		const payload = removePass(user);
		const token = createToken({ id: user._id });
		res.cookie(COOKIE_NAME, token, { httpOnly: true });
		res.status(200).send(payload);
	} catch (error) {
		console.log(error);
		res.status(400).send({ message: error.message });
	}
});

module.exports = router;