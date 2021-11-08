const { Router } = require('express');
const formidable = require('formidable');

const { createRestaurant } = require('../services/restaurantService');
const { getFormData, uploadToCloudinary } = require('../utils');
const { checkUser } = require('../middlewares');

const router = Router();

router.post('/create', checkUser(), async (req, res) => {
    const form = formidable({ multiples: true });
    const imagesURL = [];
    try {
        const [formData, incFiles] = await getFormData(req, form);

        for (const file of Object.values(incFiles)) {
            const url = await uploadToCloudinary(file.path);
            imagesURL.push(url);
        }

        formData.images = imagesURL;
        if (formData.images.length == 0) {
            throw new Error('At least one image is required!');
        }


        const restaurantData = {
            name: formData.name,
            mainTheme: formData.mainTheme,
            categories: formData.categories.split(',').map(x => x.trim()),
            workHours: formData.workTime.split(' ')[1].split('-'),
            workDays: formData.workTime.split(' ')[0].split('-'),
            cities: formData.cities.split(',').map(x => x.trim()),
            image: imagesURL[0],
            owner: req.decoded.id
        };

        const restaurant = await createRestaurant(restaurantData);
        res.status(200).send(restaurant);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;