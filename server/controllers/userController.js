const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    res.send('It works');
});

module.exports = router;