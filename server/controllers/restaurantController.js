const { Router } = require('express');
const formidable = require('formidable');

const { createRestaurant, getByOwnerId, getById, deleteById } = require('../services/restaurantService');
const { getFormData, uploadToCloudinary, deleteFromCloudinary } = require('../utils');
const { checkUser } = require('../middlewares');

const router = Router();

router.post('/create', checkUser(), async (req, res) => {
    const form = formidable({ multiples: true });
    const imagesURL = [];
    try {
        const [formData, incFiles] = await getFormData(req, form);

        for (const file of Object.values(incFiles)) {
            const res = await uploadToCloudinary(file.path);
            imagesURL.push({ url: res.url, public_id: res.public_id });
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
            cities: JSON.parse(formData.cities),
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

router.get('/by-owner', checkUser(), async (req, res) => {
    try {
        const restaurants = await getByOwnerId(req.decoded.id);
        res.status(200).send(restaurants);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const restaurant = await getById(req.params.id);
        res.status(200).send(restaurant);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.put('/:id', checkUser(), async (req, res) => {
    const form = formidable({ multiples: true });
    const imagesURL = [];
    try {
        const restaurant = await getById(req.params.id);
        const [formData, incFiles] = await getFormData(req, form);
        if (Object.keys(incFiles).length > 0) {
            for (const file of Object.values(incFiles)) {
                const res = await uploadToCloudinary(file.path);
                imagesURL.push({ url: res.url, public_id: res.public_id });
            }

            formData.images = imagesURL;
            if (formData.images.length == 0) {
                throw new Error('At least one image is required!');
            }
            await deleteFromCloudinary(restaurant.image.public_id);
        }

        const restaurantData = {
            name: formData.name,
            mainTheme: formData.mainTheme,
            categories: formData.categories.split(',').map(x => x.trim()),
            workHours: formData.workTime.split(' ')[1].split('-'),
            workDays: formData.workTime.split(' ')[0].split('-'),
            cities: JSON.parse(formData.cities),
            image: imagesURL[0] || restaurant.image,
            owner: req.decoded.id
        };

        Object.assign(restaurant, restaurantData);
        await restaurant.save();
        res.status(200).send(restaurant);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const restaurant = await getById(req.params.id);
        const imgId = restaurant.image.public_id;
        await deleteFromCloudinary(imgId)
        await deleteById(req.params.id);
        res.status(200).send({ message: 'Success' });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;