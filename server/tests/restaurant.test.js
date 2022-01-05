const express = require('express');
const supertest = require('supertest');
const fs = require('fs');
const path = require('path');

const expressSetup = require('../config/express');
const restaurantService = require('../services/restaurantService');
const cloudinary = require('../utils/clodinary');
const parseForm = require('../utils/parseForm');
const { createToken } = require('../utils');

const app = express();
expressSetup(app);

jest.mock('../services/restaurantService', () => {
    return {
        getRestaurants: jest.fn(),
        getCount: jest.fn(),
        createRestaurant: jest.fn(),
    }
});

jest.mock('../utils/clodinary', () => {
    return {
        uploadToCloudinary: jest.fn()
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
                .send({});

            expect(statusCode).toEqual(200);
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(createRestaurantMock).toHaveBeenCalledTimes(1);
            expect(body.name).toEqual(reqBody.name);
        });

        test('should throw error if file is not send', async () => {
            jest.spyOn(parseForm, 'getFormData').mockImplementation(() => Promise.resolve([reqBody, []]));
            const { body, statusCode } = await supertest(app).post('/api/restaurant/create')
                .set('Cookie', [`X-Authorization=${token}`])
                .send({});

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('At least one image is required!');
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(0);
            expect(createRestaurantMock).toHaveBeenCalledTimes(0);
        });

        test('should throw error if name is shorter than 6', async () => {
            reqBody.name = ""
            const { body, statusCode } = await supertest(app).post('/api/restaurant/create')
                .set('Cookie', [`X-Authorization=${token}`])
                .send({});

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Name must be at least 6 characters long!');
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(createRestaurantMock).toHaveBeenCalledTimes(0);
        });

        test('should throw error if main theme is shorter than 6', async () => {
            reqBody.mainTheme = ""
            const { body, statusCode } = await supertest(app).post('/api/restaurant/create')
                .set('Cookie', [`X-Authorization=${token}`])
                .send({});

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Main theme must be at least 6 characters long!');
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(createRestaurantMock).toHaveBeenCalledTimes(0);
        });

        test('should throw error if no category', async () => {
            reqBody.categories = ""
            const { body, statusCode } = await supertest(app).post('/api/restaurant/create')
                .set('Cookie', [`X-Authorization=${token}`])
                .send({});

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('At least one category is required!');
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(createRestaurantMock).toHaveBeenCalledTimes(0);
        });

        test('should throw error if incorrect work time', async () => {
            reqBody.workTime = ""
            const { body, statusCode } = await supertest(app).post('/api/restaurant/create')
                .set('Cookie', [`X-Authorization=${token}`])
                .send({});

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Incorrect work time!');
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(createRestaurantMock).toHaveBeenCalledTimes(0);
        });

        test('should throw error if no city', async () => {
            reqBody.cities = JSON.stringify([]);
            const { body, statusCode } = await supertest(app).post('/api/restaurant/create')
                .set('Cookie', [`X-Authorization=${token}`])
                .send({});

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('At least one city is required!');
            expect(uploadToCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(createRestaurantMock).toHaveBeenCalledTimes(0);
        });
    });
});