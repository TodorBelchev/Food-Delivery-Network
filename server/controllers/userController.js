const { Router } = require('express');

const router = Router();

router.post('/login', (req, res) => {
	res.status(200).send({ email: 'pesho@abv.bg'});
});

router.post('/register', (req, res) => {
	res.status(200).send({ email: 'pesho@abv.bg'});
});

module.exports = router;