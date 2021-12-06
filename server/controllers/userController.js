const { Router } = require('express');
const bcrypt = require('bcrypt');

const { SALT_ROUNDS, COOKIE_NAME } = require('../config');
const { getUserByEmail, createUser, editUserById, getUserById } = require('../services/userService');
const { removePass, createToken } = require('../utils');
const { isLoggedIn, checkUser } = require('../middlewares');
const { isEmail, isPhone } = require('../validators');

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

router.put('/:id', isLoggedIn(), async (req, res) => {
	try {
		if (req.decoded.id !== req.params.id) {
			throw new Error('Not authorized!');
		}
		
		const firstName = req.body.firstName.trim();
		const lastName = req.body.lastName.trim();
		const email = req.body.email.trim();
		const phone = req.body.phone.trim();
		const city = req.body.city.trim();
		const address = req.body.address.trim();

		if (firstName.length < 4) {
			throw new Error('First name must be at least 4 characters long!');
		}
		if (lastName.length < 4) {
			throw new Error('Last name must be at least 4 characters long!');
		}
		if (city.length < 4) {
			throw new Error('City must be at least 4 characters long!');
		}
		if (address.length < 4) {
			throw new Error('Address must be at least 4 characters long!');
		}
		if (!isEmail(email)) {
			throw new Error('Please enter a valid email!');
		}
		if (!isPhone(phone)) {
			throw new Error('Please enter a valid phone number!');
		}

		const user = await editUserById(req.params.id, { firstName, lastName, email, phone, city, address });
		const payload = removePass(user);
		res.status(200).send(payload);
	} catch (error) {
		console.log(error);
		res.status(400).send({ message: error.message });
	}
});

router.get('/verify', checkUser(), async (req, res) => {
	try {
		let payload = {};
		if (req.decoded) {
			const user = await getUserById(req.decoded.id);
			payload = removePass(user);
		}
		res.status(200).send(payload);
	} catch (error) {
		console.log(error);
		res.status(400).send({ message: error.message });
	}
});

router.get('/logout', (req, res) => {
	res.clearCookie(COOKIE_NAME);
	res.status(200).send({ message: 'Logged out' });
});

module.exports = router;