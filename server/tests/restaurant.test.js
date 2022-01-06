const express = require('express');
const supertest = require('supertest');
const fs = require('fs');
const path = require('path');

const expressSetup = require('../config/express');
const restaurantService = require('../services/restaurantService');
const commentService = require('../services/commentService');
const cloudinary = require('../utils/clodinary');
const parseForm = require('../utils/parseForm');
const { createToken } = require('../utils');
const { get } = require('express/lib/request');

const app = express();
expressSetup(app);

jest.mock('../services/restaurantService', () => {
    return {
        getRestaurants: jest.fn(),
        getCount: jest.fn(),
        createRestaurant: jest.fn(),
        getByOwnerId: jest.fn(),
        getFavorites: jest.fn(),
        getById: jest.fn(),
        deleteById: jest.fn(),
    }
});

jest.mock('../services/commentService', () => {
    return {
        createComment: jest.fn(),
        getCommentsByRestaurantIdAndPage: jest.fn(),
        getAllRatingsByRestaurantId: jest.fn(),
        getCommentById: jest.fn(),
        getCommentsCountByRestaurantId: jest.fn(),
        deleteCommentById: jest.fn()
    }
});

jest.mock('../utils/clodinary', () => {
    return {
        uploadToCloudinary: jest.fn(),
        deleteFromCloudinary: jest.fn()
    }
});

jest.mock('../utils/parseForm', () => {
    return {
        getFormData: jest.fn()
    }
});

jest.useFakeTimers();

describe('Restaurant controller', () => {
    let file;
    beforeAll(() => {
        const filePath = path.resolve('../server/demo-data/demo-img.jpg');
        file = fs.readFileSync(filePath);
    });

    describe('GET /', () => {
        test('should return restaurants and total count', async () => {
            const resBody = [{ _id: '123', name: 'Restaurant name' }];
            const getRestaurantsMock = jest.spyOn(restaurantService, 'getRestaurants')
                .mockImplementation(() => Promise.resolve(resBody));
            const getCountMock = jest.spyOn(restaurantService, 'getCount')
                .mockImplementation(() => Promise.resolve(1));
            const { body, statusCode } = await supertest(app).get('/api/restaurant?page=1&sort=desc');

            expect(statusCode).toEqual(200);
            expect(getRestaurantsMock).toHaveBeenCalledTimes(1);
            expect(getCountMock).toHaveBeenCalledTimes(1);
            expect(body.restaurants).toEqual(resBody);
            expect(body.count).toEqual(1);
        });

        test('should return restaurants and total count without query params', async () => {
            const resBody = [{ _id: '123', name: 'Restaurant name' }];
            const getRestaurantsMock = jest.spyOn(restaurantService, 'getRestaurants')
                .mockImplementation(() => Promise.resolve(resBody));
            const getCountMock = jest.spyOn(restaurantService, 'getCount')
                .mockImplementation(() => Promise.resolve(1));
            const { body, statusCode } = await supertest(app).get('/api/restaurant');

            expect(statusCode).toEqual(200);
            expect(getRestaurantsMock).toHaveBeenCalledTimes(1);
            expect(getCountMock).toHaveBeenCalledTimes(1);
            expect(body.restaurants).toEqual(resBody);
            expect(body.count).toEqual(1);
        });

        test('should throw error if db error', async () => {
            jest.spyOn(restaurantService, 'getRestaurants')
                .mockImplementation(() => Promise.reject({ message: 'DB error' }));
            const { body, statusCode } = await supertest(app).get('/api/restaurant');

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('DB error');
        });
    });

    describe('POST /create', () => {
        let reqBody;
        let token;
        let createRestaurantMock;
        let uploadToCloudinaryMock;

        beforeEach(() => {
            reqBody = {
                name: 'Restaurant name',
                mainTheme: 'Main theme',
                categories: 'a,b,c',
                workTime: 'Monday-Sunday 11:00-23:00',
                cities: JSON.stringify(['Sofia']),
            }
            token = createToken({ email: 'pesho@abv.bg', id: '123' });
            jest.spyOn(parseForm, 'getFormData').mockImplementation(() => Promise.resolve([reqBody, [file]]));
            createRestaurantMock = jest.spyOn(restaurantService, 'createRestaurant')
                .mockImplementation(() => Promise.resolve({ ...reqBody, image: { url: 'some url', public_id: '123' } }));
            uploadToCloudinaryMock = jest.spyOn(cloudinary, 'uploadToCloudinary')
                .mockImplementation(() => Promise.resolve({ url: 'some url', public_id: '123' }));
        });

        test('should create and return restaurant', async () => {
            const { body, statusCode } = await supertest(app).post('/api/restaurant/create')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(200);
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(createRestaurantMock).toHaveBeenCalledTimes(1);
            expect(body.name).toEqual(reqBody.name);
        });

        test('should throw error if file is not send', async () => {
            jest.spyOn(parseForm, 'getFormData').mockImplementation(() => Promise.resolve([reqBody, []]));
            const { body, statusCode } = await supertest(app).post('/api/restaurant/create')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('At least one image is required!');
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(0);
            expect(createRestaurantMock).toHaveBeenCalledTimes(0);
        });

        test('should throw error if name is shorter than 6', async () => {
            reqBody.name = ""
            const { body, statusCode } = await supertest(app).post('/api/restaurant/create')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Name must be at least 6 characters long!');
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(createRestaurantMock).toHaveBeenCalledTimes(0);
        });

        test('should throw error if main theme is shorter than 6', async () => {
            reqBody.mainTheme = ""
            const { body, statusCode } = await supertest(app).post('/api/restaurant/create')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Main theme must be at least 6 characters long!');
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(createRestaurantMock).toHaveBeenCalledTimes(0);
        });

        test('should throw error if no category', async () => {
            reqBody.categories = ""
            const { body, statusCode } = await supertest(app).post('/api/restaurant/create')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('At least one category is required!');
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(createRestaurantMock).toHaveBeenCalledTimes(0);
        });

        test('should throw error if incorrect work time', async () => {
            reqBody.workTime = ""
            const { body, statusCode } = await supertest(app).post('/api/restaurant/create')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Incorrect work time!');
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(createRestaurantMock).toHaveBeenCalledTimes(0);
        });

        test('should throw error if no city', async () => {
            reqBody.cities = JSON.stringify([]);
            const { body, statusCode } = await supertest(app).post('/api/restaurant/create')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('At least one city is required!');
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(createRestaurantMock).toHaveBeenCalledTimes(0);
        });

        test('should throw error if db error', async () => {
            jest.spyOn(restaurantService, 'createRestaurant')
                .mockImplementation(() => Promise.reject({ message: 'DB error' }));
            const { body, statusCode } = await supertest(app).post('/api/restaurant/create')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('DB error');
        });
    });

    describe('GET /by-owner', () => {
        let token;
        beforeEach(() => {
            token = createToken({ email: 'pesho@abv.bg', id: '123' });
        });

        test('should return owner restaurants and total count', async () => {
            const resBody = [{ _id: '123', name: 'Restaurant name' }];
            const getByOwnerIdMock = jest.spyOn(restaurantService, 'getByOwnerId')
                .mockImplementation(() => Promise.resolve(resBody));
            const getCountMock = jest.spyOn(restaurantService, 'getCount')
                .mockImplementation(() => Promise.resolve(1));
            const { body, statusCode } = await supertest(app).get('/api/restaurant/by-owner?page=1&sort=desc')
                .set('Cookie', [`X-Authorization=${token}`]);

            expect(statusCode).toEqual(200);
            expect(getByOwnerIdMock).toHaveBeenCalledTimes(1);
            expect(getCountMock).toHaveBeenCalledTimes(1);
            expect(body.restaurants).toEqual(resBody);
            expect(body.count).toEqual(1);
        });

        test('should return owner restaurants and total count without query params', async () => {
            const resBody = [{ _id: '123', name: 'Restaurant name' }];
            const getByOwnerIdMock = jest.spyOn(restaurantService, 'getByOwnerId')
                .mockImplementation(() => Promise.resolve(resBody));
            const getCountMock = jest.spyOn(restaurantService, 'getCount')
                .mockImplementation(() => Promise.resolve(1));
            const { body, statusCode } = await supertest(app).get('/api/restaurant/by-owner')
                .set('Cookie', [`X-Authorization=${token}`]);

            expect(statusCode).toEqual(200);
            expect(getByOwnerIdMock).toHaveBeenCalledTimes(1);
            expect(getCountMock).toHaveBeenCalledTimes(1);
            expect(body.restaurants).toEqual(resBody);
            expect(body.count).toEqual(1);
        });

        test('should throw if not logged in', async () => {
            const resBody = [{ _id: '123', name: 'Restaurant name' }];
            const getByOwnerIdMock = jest.spyOn(restaurantService, 'getByOwnerId')
                .mockImplementation(() => Promise.resolve(resBody));
            const getCountMock = jest.spyOn(restaurantService, 'getCount')
                .mockImplementation(() => Promise.resolve(1));
            const { body, statusCode } = await supertest(app).get('/api/restaurant/by-owner');

            expect(statusCode).toEqual(401);
            expect(getByOwnerIdMock).toHaveBeenCalledTimes(0);
            expect(getCountMock).toHaveBeenCalledTimes(0);
            expect(body.message).toEqual('Please log in');
        });

        test('should throw error if db error', async () => {
            jest.spyOn(restaurantService, 'getByOwnerId')
                .mockImplementation(() => Promise.reject({ message: 'DB error' }));
            const { body, statusCode } = await supertest(app).get('/api/restaurant/by-owner')
                .set('Cookie', [`X-Authorization=${token}`]);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('DB error');
        });
    });

    describe('GET /favorites', () => {
        test('should return favorites and count', async () => {
            const getFavoritesMock = jest.spyOn(restaurantService, 'getFavorites')
                .mockImplementation(() => Promise.resolve([{}]));
            const getCountMock = jest.spyOn(restaurantService, 'getCount')
                .mockImplementation(() => Promise.resolve(1));
            const { body, statusCode } = await supertest(app).get('/api/restaurant/favorites?favorites=[%2261ac82d66dcf96178b058048%22,%22618ce1da59ad1d89291c4903%22]');

            expect(statusCode).toEqual(200);
            expect(getFavoritesMock).toHaveBeenCalledTimes(1);
            expect(getCountMock).toHaveBeenCalledTimes(1);
            expect(body.restaurants).toEqual([{}]);
            expect(body.count).toEqual(1);
        });

        test('should return favorites in desc order and count', async () => {
            const getFavoritesMock = jest.spyOn(restaurantService, 'getFavorites')
                .mockImplementation(() => Promise.resolve([{}]));
            const getCountMock = jest.spyOn(restaurantService, 'getCount')
                .mockImplementation(() => Promise.resolve(1));
            const { body, statusCode } = await supertest(app).get('/api/restaurant/favorites?sort=desc&favorites=[%2261ac82d66dcf96178b058048%22,%22618ce1da59ad1d89291c4903%22]');

            expect(statusCode).toEqual(200);
            expect(getFavoritesMock).toHaveBeenCalledTimes(1);
            expect(getCountMock).toHaveBeenCalledTimes(1);
            expect(body.restaurants).toEqual([{}]);
            expect(body.count).toEqual(1);
        });

        test('should throw error if db error', async () => {
            jest.spyOn(restaurantService, 'getFavorites')
                .mockImplementation(() => Promise.reject({ message: 'DB error' }));
            const { body, statusCode } = await supertest(app).get('/api/restaurant/favorites?favorites=[%2261ac82d66dcf96178b058048%22,%22618ce1da59ad1d89291c4903%22]');

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('DB error');
        });
    });

    describe('GET /:id', () => {
        test('should return restaurant', async () => {
            const getByIdMock = jest.spyOn(restaurantService, 'getById')
                .mockImplementation(() => Promise.resolve({ _id: '123', name: 'Restaurant name' }));
            const { body, statusCode } = await supertest(app).get('/api/restaurant/123');

            expect(statusCode).toEqual(200);
            expect(getByIdMock).toHaveBeenCalledTimes(1);
            expect(body.name).toEqual('Restaurant name');
        });

        test('should throw error if db error', async () => {
            jest.spyOn(restaurantService, 'getById')
                .mockImplementation(() => Promise.reject({ message: 'DB error' }));
            const { body, statusCode } = await supertest(app).get('/api/restaurant/123');

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('DB error');
        });
    });

    describe('PUT /:id', () => {
        let reqBody;
        let token;
        let getByIdMock;
        let uploadToCloudinaryMock;

        beforeEach(() => {
            reqBody = {
                name: 'Restaurant name',
                mainTheme: 'Main theme',
                categories: 'a,b,c',
                workTime: 'Monday-Sunday 11:00-23:00',
                cities: JSON.stringify(['Sofia']),
            }
            token = createToken({ email: 'pesho@abv.bg', id: '123' });
            jest.spyOn(parseForm, 'getFormData').mockImplementation(() => Promise.resolve([reqBody, [file]]));
            getByIdMock = jest.spyOn(restaurantService, 'getById')
                .mockImplementation(() => Promise.resolve({
                    save: () => Promise.resolve(reqBody),
                    owner: '123',
                    image: { public_id: '123', url: 'aaa' }
                }));
            uploadToCloudinaryMock = jest.spyOn(cloudinary, 'uploadToCloudinary')
                .mockImplementation(() => Promise.resolve({ url: 'some url', public_id: '123' }));
            deleteFromCloudinaryMock = jest.spyOn(cloudinary, 'deleteFromCloudinary')
                .mockImplementation(() => Promise.resolve({}));
        });

        test('should edit and return restaurant', async () => {
            const { body, statusCode } = await supertest(app).put('/api/restaurant/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(200);
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(getByIdMock).toHaveBeenCalledTimes(2);
            expect(body.name).toEqual(reqBody.name);
        });

        test('should throw error if name is shorter than 6', async () => {
            reqBody.name = ""
            const { body, statusCode } = await supertest(app).put('/api/restaurant/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Name must be at least 6 characters long!');
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(getByIdMock).toHaveBeenCalledTimes(2);
        });

        test('should throw error if main theme is shorter than 6', async () => {
            reqBody.mainTheme = ""
            const { body, statusCode } = await supertest(app).put('/api/restaurant/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Main theme must be at least 6 characters long!');
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(getByIdMock).toHaveBeenCalledTimes(2);
        });

        test('should throw error if no category', async () => {
            reqBody.categories = ""
            const { body, statusCode } = await supertest(app).put('/api/restaurant/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('At least one category is required!');
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(getByIdMock).toHaveBeenCalledTimes(2);
        });

        test('should throw error if incorrect work time', async () => {
            reqBody.workTime = ""
            const { body, statusCode } = await supertest(app).put('/api/restaurant/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Incorrect work time!');
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(getByIdMock).toHaveBeenCalledTimes(2);
        });

        test('should throw error if no city', async () => {
            reqBody.cities = JSON.stringify([]);
            const { body, statusCode } = await supertest(app).put('/api/restaurant/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('At least one city is required!');
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(getByIdMock).toHaveBeenCalledTimes(2);
        });
    });

    describe('DELETE /:id', () => {
        let token;

        beforeEach(() => {
            token = createToken({ email: 'pesho@abv.bg', id: '123' });
            deleteRestaurantMock = jest.spyOn(restaurantService, 'deleteById')
                .mockImplementation(() => Promise.resolve({}));
            deleteFromCloudinaryMock = jest.spyOn(cloudinary, 'deleteFromCloudinary')
                .mockImplementation(() => Promise.resolve({}));
            getByIdMock = jest.spyOn(restaurantService, 'getById')
                .mockImplementation(() => Promise.resolve({
                    owner: '123',
                    image: { public_id: '123', url: 'aaa' }
                }));
        });

        test('should delete restaurant', async () => {
            const { body, statusCode } = await supertest(app).delete('/api/restaurant/123')
                .set('Cookie', [`X-Authorization=${token}`]);

            expect(statusCode).toEqual(200);
            expect(body.message).toEqual('Success');
        });

        test('should throw error if user is not logged in', async () => {
            const { body, statusCode } = await supertest(app).delete('/api/restaurant/123');

            expect(statusCode).toEqual(401);
            expect(body.message).toEqual('Please log in');
        });

        test('should throw error if user is not owner', async () => {
            token = createToken({ email: 'pesho@abv.bg', id: '123456' });
            const { body, statusCode } = await supertest(app).delete('/api/restaurant/123')
                .set('Cookie', [`X-Authorization=${token}`]);

            expect(statusCode).toEqual(401);
            expect(body.message).toEqual('Not authorized');
        });

        test('should throw error if db error', async () => {
            deleteRestaurantMock = jest.spyOn(restaurantService, 'deleteById')
                .mockImplementation(() => Promise.reject({ message: 'db error' }));
            const { body, statusCode } = await supertest(app).delete('/api/restaurant/123')
                .set('Cookie', [`X-Authorization=${token}`]);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('db error');
        });
    });

    describe('POST /:id/comment', () => {
        let token;
        let createCommentMock;
        let getByIdMock;
        let getCommentsByRestaurantIdAndPageMock;
        let getAllRatingsByRestaurantIdMock;
        let reqBody;

        beforeEach(() => {
            reqBody = {
                rating: '5',
                comment: 'lorem ipsum',
                name: 'John Doe'
            }
            token = createToken({ email: 'pesho@abv.bg', id: '123' });
            createCommentMock = jest.spyOn(commentService, 'createComment')
                .mockImplementation(() => Promise.resolve({}));
            getByIdMock = jest.spyOn(restaurantService, 'getById')
                .mockImplementation(() => Promise.resolve({
                    save: () => Promise.resolve({}),
                    owner: '123',
                    image: { public_id: '123', url: 'aaa' }
                }));
            getCommentsByRestaurantIdAndPageMock = jest.spyOn(commentService, 'getCommentsByRestaurantIdAndPage')
                .mockImplementation(() => Promise.resolve([]));
            getAllRatingsByRestaurantIdMock = jest.spyOn(commentService, 'getAllRatingsByRestaurantId')
                .mockImplementation(() => Promise.resolve([{ rating: 5 }]));
        });

        test('should create comment', async () => {
            const { body, statusCode } = await supertest(app).post('/api/restaurant/123/comment')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(200);
            expect(body.restaurant).toBeDefined();
            expect(body.comments).toBeDefined();
            expect(getByIdMock).toHaveBeenCalledTimes(1);
            expect(getCommentsByRestaurantIdAndPageMock).toHaveBeenCalledTimes(1);
            expect(getAllRatingsByRestaurantIdMock).toHaveBeenCalledTimes(1);
            expect(createCommentMock).toHaveBeenCalledTimes(1);
        });

        test('should throw if user is not logged in', async () => {
            const { body, statusCode } = await supertest(app).post('/api/restaurant/123/comment')
                .send(reqBody);

            expect(statusCode).toEqual(401);
            expect(body.message).toEqual('Please log in');
        });

        test('should throw name length < 6', async () => {
            reqBody.name = '';
            const { body, statusCode } = await supertest(app).post('/api/restaurant/123/comment')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Name must be at least 6 characters long!');
        });

        test('should throw comment length < 10', async () => {
            reqBody.comment = '';
            const { body, statusCode } = await supertest(app).post('/api/restaurant/123/comment')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Comment must be at least 10 characters long!');
        });

        test('should throw no rating', async () => {
            reqBody.rating = '';
            const { body, statusCode } = await supertest(app).post('/api/restaurant/123/comment')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Rating is required!');
        });
    });

    describe('PUT /:id/comment', () => {
        let token;
        let getCommentByIdMock;
        let getByIdMock;
        let getAllRatingsByRestaurantIdMock;
        let reqBody;

        beforeEach(() => {
            reqBody = {
                rating: '5',
                comment: 'lorem ipsum',
                name: 'John Doe'
            }
            token = createToken({ email: 'pesho@abv.bg', id: '123' });
            getCommentByIdMock = jest.spyOn(commentService, 'getCommentById')
                .mockImplementation(() => Promise.resolve({
                    save: () => Promise.resolve({}),
                    owner: '123'
                }));
            getByIdMock = jest.spyOn(restaurantService, 'getById')
                .mockImplementation(() => Promise.resolve({
                    save: () => Promise.resolve({}),
                    owner: '123',
                    image: { public_id: '123', url: 'aaa' }
                }));
            getAllRatingsByRestaurantIdMock = jest.spyOn(commentService, 'getAllRatingsByRestaurantId')
                .mockImplementation(() => Promise.resolve([{ rating: 5 }]));
        });

        test('should edit comment', async () => {
            const { body, statusCode } = await supertest(app).put('/api/restaurant/123/comment/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(200);
            expect(body.restaurant).toBeDefined();
            expect(body.comment).toBeDefined();
            expect(getByIdMock).toHaveBeenCalledTimes(1);
            expect(getAllRatingsByRestaurantIdMock).toHaveBeenCalledTimes(1);
            expect(getCommentByIdMock).toHaveBeenCalledTimes(2);
        });

        test('should throw if user is not logged in', async () => {
            const { body, statusCode } = await supertest(app).put('/api/restaurant/123/comment/123')
                .send(reqBody);

            expect(statusCode).toEqual(401);
            expect(body.message).toEqual('Please log in');
        });

        test('should throw name length < 6', async () => {
            reqBody.name = '';
            const { body, statusCode } = await supertest(app).put('/api/restaurant/123/comment/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Name must be at least 6 characters long!');
        });

        test('should throw comment length < 10', async () => {
            reqBody.comment = '';
            const { body, statusCode } = await supertest(app).put('/api/restaurant/123/comment/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Comment must be at least 10 characters long!');
        });

        test('should throw no rating', async () => {
            reqBody.rating = '';
            const { body, statusCode } = await supertest(app).put('/api/restaurant/123/comment/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Rating is required!');
        });
    });

    describe('GET /:id/comment', () => {
        let getCommentsByRestaurantIdAndPageMock;

        beforeEach(() => {
            token = createToken({ email: 'pesho@abv.bg', id: '123' });
            getCommentsByRestaurantIdAndPageMock = jest.spyOn(commentService, 'getCommentsByRestaurantIdAndPage')
                .mockImplementation(() => Promise.resolve([]));
            getCommentsCountByRestaurantIdMock = jest.spyOn(commentService, 'getCommentsCountByRestaurantId')
                .mockImplementation(() => Promise.resolve(0));
        });

        test('should return comments and count', async () => {
            const { body, statusCode } = await supertest(app).get('/api/restaurant/123/comment')
                .set('Cookie', [`X-Authorization=${token}`]);

            expect(statusCode).toEqual(200);
            expect(body.comments).toEqual([]);
            expect(body.ratingsCount).toEqual(0);
            expect(body.tokenExpired).toEqual(false);
        });

        test('should throw if db error', async () => {
            getCommentsCountByRestaurantIdMock = jest.spyOn(commentService, 'getCommentsCountByRestaurantId')
                .mockImplementation(() => Promise.reject({ message: 'db error' }));
            const { body, statusCode } = await supertest(app).get('/api/restaurant/123/comment')
                .set('Cookie', [`X-Authorization=${token}`]);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('db error');
        });
    });

    describe('DELETE /:restaurantId/comment/:commentId', () => {
        let deleteCommentByIdMock;
        let getAllRatingsByRestaurantIdMock;
        let getByIdMock;
        let getCommentByIdMock;
        let token = createToken({ email: 'pesho@abv.bg', id: '123' });

        beforeEach(() => {
            deleteCommentByIdMock = jest.spyOn(commentService, 'deleteCommentById')
                .mockImplementation(() => Promise.resolve({}));
            getAllRatingsByRestaurantIdMock = jest.spyOn(commentService, 'getAllRatingsByRestaurantId')
                .mockImplementation(() => Promise.resolve([{ rating: 5 }]));
            getByIdMock = jest.spyOn(restaurantService, 'getById')
                .mockImplementation(() => Promise.resolve({
                    save: () => Promise.resolve({}),
                    owner: '123',
                }));
            getCommentByIdMock = jest.spyOn(commentService, 'getCommentById')
                .mockImplementation(() => Promise.resolve({
                    owner: '123'
                }));
        });

        test('should delete comment', async () => {
            const { body, statusCode } = await supertest(app).delete('/api/restaurant/123/comment/123')
                .set('Cookie', [`X-Authorization=${token}`]);

            expect(statusCode).toEqual(200);
            expect(body.owner).toEqual('123');
        });

        test('should throw if user is not logged in', async () => {
            const { body, statusCode } = await supertest(app).delete('/api/restaurant/123/comment/123');

            expect(statusCode).toEqual(401);
            expect(body.message).toEqual('Please log in');
        });

        test('should throw if user is not owner', async () => {
            getCommentByIdMock = jest.spyOn(commentService, 'getCommentById')
                .mockImplementation(() => Promise.resolve({
                    owner: '123456'
                }));
            const { body, statusCode } = await supertest(app).delete('/api/restaurant/123/comment/123')
                .set('Cookie', [`X-Authorization=${token}`]);

            expect(statusCode).toEqual(401);
            expect(body.message).toEqual('Not authorized');
        });

        test('should throw if db error', async () => {
            deleteCommentByIdMock = jest.spyOn(commentService, 'deleteCommentById')
                .mockImplementation(() => Promise.reject({ message: 'db error' }));
            const { body, statusCode } = await supertest(app).delete('/api/restaurant/123/comment/123')
                .set('Cookie', [`X-Authorization=${token}`]);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('db error');
        });
    });
});