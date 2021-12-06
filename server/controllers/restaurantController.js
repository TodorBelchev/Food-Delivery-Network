const { Router } = require('express');
const formidable = require('formidable');

const {
    getRestaurants,
    createRestaurant,
    getByOwnerId,
    getById,
    deleteById
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
    extractFilterFromQuery
} = require('../utils');
const { isLoggedIn, checkUser, isOwner, isCommentOwner } = require('../middlewares');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const filter = extractFilterFromQuery(req.query);
        const restaurants = await getRestaurants(filter);
        res.status(200).send(restaurants);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.post('/create', isLoggedIn(), async (req, res) => {
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

        if (restaurantData.name.length < 6) {
            throw new Error('Name must be at least 6 characters long!');
        }

        if (restaurantData.mainTheme.length < 6) {
            throw new Error('Main theme must be at least 6 characters long!');
        }

        if (restaurantData.categories.length < 1) {
            throw new Error('At least one category is required!');
        }

        if (formData.workTime.length < 6) {
            throw new Error('Incorrect work time!');
        }

        if (!restaurantData.image) {
            throw new Error('Image is required!');
        }

        if (restaurantData.cities.length < 1) {
            throw new Error('At least one city is required!');
        }

        const restaurant = await createRestaurant(restaurantData);
        res.status(200).send(restaurant);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.get('/by-owner', isLoggedIn(), async (req, res) => {
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
        const restaurant = await getById(req.params.id).lean();
        res.status(200).send(restaurant);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.put('/:restaurantId', isLoggedIn(), isOwner(), async (req, res) => {
    const form = formidable({ multiples: true });
    const imagesURL = [];
    try {
        const restaurant = await getById(req.params.restaurantId);
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

        if (restaurantData.name.length < 6) {
            throw new Error('Name must be at least 6 characters long!');
        }

        if (restaurantData.mainTheme.length < 6) {
            throw new Error('Main theme must be at least 6 characters long!');
        }

        if (restaurantData.categories.length < 1) {
            throw new Error('At least one category is required!');
        }

        if (formData.workTime.length < 6) {
            throw new Error('Incorrect work time!');
        }

        if (!restaurantData.image) {
            throw new Error('Image is required!');
        }

        if (restaurantData.cities.length < 1) {
            throw new Error('At least one city is required!');
        }

        Object.assign(restaurant, restaurantData);
        await restaurant.save();
        res.status(200).send(restaurant);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.delete('/:restaurantId', isLoggedIn(), isOwner(), async (req, res) => {
    try {
        const restaurant = await getById(req.params.restaurantId);
        const imgId = restaurant.image.public_id;
        await deleteFromCloudinary(imgId)
        await deleteById(req.params.restaurantId);
        res.status(200).send({ message: 'Success' });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.post('/:id/comment', isLoggedIn(), async (req, res) => {
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
        const restaurant = await getById(req.params.id);
        Object.assign(restaurant, { rating: restaurantRating, ratingsCount });
        await restaurant.save();

        res.status(200).send({ comments, restaurant });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.put('/:id/comment/:commentId', isLoggedIn(), isCommentOwner(),  async (req, res) => {
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

        const ratings = await getAllRatingsByRestaurantId(req.params.id);
        let restaurantRating = 0;
        if (ratings.length > 0) {
            restaurantRating = (ratings.reduce((acc, cur) => acc + cur.rating, 0) / ratings.length).toFixed(1);
        }
        const ratingsCount = ratings.length;
        const restaurant = await getById(req.params.id);
        Object.assign(restaurant, { rating: restaurantRating, ratingsCount });
        await restaurant.save();

        res.status(200).send({ comment, restaurant });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.get('/:id/comment', checkUser(), async (req, res) => {
    try {
        const comments = await getCommentsByRestaurantIdAndPage(req.params.id, req.query.page - 1);
        const ratingsCount = await getCommentsCountByRestaurantId(req.params.id);
        const response = { comments, ratingsCount, tokenExpired: true };
        if (req.decoded) {
            response.tokenExpired = false;
        }
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.delete('/:restaurantId/comment/:commentId', isLoggedIn(), isCommentOwner(), async (req, res) => {
    try {
        await deleteCommentById(req.params.commentId);
        const ratings = await getAllRatingsByRestaurantId(req.params.restaurantId);
        let rating = 0;
        if (ratings.length > 0) {
            rating = (ratings.reduce((acc, cur) => acc + cur.rating, 0) / ratings.length).toFixed(1);
        }
        const ratingsCount = ratings.length;
        const restaurant = await getById(req.params.restaurantId);
        Object.assign(restaurant, { rating, ratingsCount });
        await restaurant.save();

        res.status(200).send(restaurant);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;