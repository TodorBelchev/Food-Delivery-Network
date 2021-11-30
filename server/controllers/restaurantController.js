const { Router } = require('express');
const formidable = require('formidable');

const {
    getRestaurants,
    createRestaurant,
    getByOwnerId,
    getById,
    deleteById,
    editRestaurant
} = require('../services/restaurantService');
const {
    createComment,
    getCommentsByRestaurantIdAndPage,
    getCommentById,
    getCommentsCountByRestaurantId,
    getAllRatingsByRestaurantId,
    deleteCommentById
} = require('../services/commentService');
const {
    getFormData,
    uploadToCloudinary,
    deleteFromCloudinary,
    attachRating,
    extractFilterFromQuery
} = require('../utils');
const { checkUser } = require('../middlewares');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const filter = extractFilterFromQuery(req.query);
        const restaurants = await getRestaurants(filter);
        const ratings = await Promise.all(restaurants.map(x => getAllRatingsByRestaurantId(x._id)));
        attachRating(restaurants, ratings);
        res.status(200).send(restaurants);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

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
        const ratings = await Promise.all(restaurants.map(x => getAllRatingsByRestaurantId(x._id)));
        attachRating(restaurants, ratings);
        res.status(200).send(restaurants);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const restaurant = await getById(req.params.id);
        const ratings = await getAllRatingsByRestaurantId(req.params.id);
        attachRating([restaurant], [ratings]);
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

        await editRestaurant(req.params.id, restaurantData);
        const editedRestaurant = await getById(req.params.id);
        const ratings = await getAllRatingsByRestaurantId(req.params.id);
        attachRating([editedRestaurant], [ratings]);
        res.status(200).send(editedRestaurant);
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

router.post('/:id/comment', checkUser(), async (req, res) => {
    try {
        const name = req.body.name.trim();
        const comment = req.body.comment.trim();
        const rating = Number(req.body.rating.trim());

        if (name.length < 6) {
            throw new Error('Name must be at least 6 characters long!')
        }

        if (comment.length < 10) {
            throw new Error('Comment must be at least 10 characters long!')
        }

        if (!rating) {
            throw new Error('Rating is required!')
        }

        const date = Date.now();

        await createComment({ name, comment, rating, owner: req.decoded.id, restaurant: req.params.id, date });
        const comments = await getCommentsByRestaurantIdAndPage(req.params.id);
        const ratings = await getAllRatingsByRestaurantId(req.params.id);
        let restaurantRating = 0;
        if (ratings.length > 0) {
            restaurantRating = (ratings.reduce((acc, cur) => acc + cur.rating, 0) / ratings.length).toFixed(1);
        }
        const ratingsCount = ratings.length;
        res.status(200).send({ comments, rating: restaurantRating, ratingsCount });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.put('/:id/comment/:commentId', checkUser(), async (req, res) => {
    try {
        const name = req.body.name.trim();
        const commentText = req.body.comment.trim();
        const rating = Number(req.body.rating.trim());

        if (name.length < 6) {
            throw new Error('Name must be at least 6 characters long!')
        }

        if (commentText.length < 10) {
            throw new Error('Comment must be at least 10 characters long!')
        }

        if (!rating) {
            throw new Error('Rating is required!')
        }


        const comment = await getCommentById(req.params.commentId);
        Object.assign(comment, { name, comment: commentText, rating });
        await comment.save();
        res.status(200).send(comment);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.get('/:id/comment', checkUser(), async (req, res) => {
    try {
        const comments = await getCommentsByRestaurantIdAndPage(req.params.id, req.query.page - 1);
        const ratingsCount = await getCommentsCountByRestaurantId(req.params.id);
        res.status(200).send({ comments, ratingsCount });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.delete('/comment/:id', checkUser(), async (req, res) => {
    try {
        await deleteCommentById(req.params.id);
        res.status(200).send({ message: 'OK' });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;