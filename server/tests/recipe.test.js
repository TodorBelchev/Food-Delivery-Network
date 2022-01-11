const express = require('express');
const supertest = require('supertest');
const fs = require('fs');
const path = require('path');

const expressSetup = require('../config/express');
const recipeService = require('../services/recipeService');
const restaurantService = require('../services/restaurantService');
const cloudinary = require('../utils/clodinary');
const parseForm = require('../utils/parseForm');
const { createToken } = require('../utils');

const app = express();
expressSetup(app);

jest.mock('../services/recipeService', () => {
    return {
        createRecipe: jest.fn(),
        getRecipeById: jest.fn(),
        deleteById: jest.fn(),
    }
});

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

describe('Recipe controller', () => {
    let file;
    beforeAll(() => {
        const filePath = path.resolve('../server/demo-data/demo-img.jpg');
        file = fs.readFileSync(filePath);
    });

    describe('POST /:restaurantId/add-recipe', () => {
        let reqBody;
        let token;
        let createRecipeMock;
        let uploadToCloudinaryMock;
        let getByIdMock;

        beforeEach(() => {
            reqBody = {
                name: 'Recipe name',
                category: 'category',
                price: '3.99',
                weight: '399',
                ingredients: JSON.stringify(['ingredient 1', 'ingredient 2', 'ingredient 3']),
            }
            token = createToken({ email: 'pesho@abv.bg', id: '123' });
            jest.spyOn(parseForm, 'getFormData').mockImplementation(() => Promise.resolve([reqBody, [file]]));
            createRecipeMock = jest.spyOn(recipeService, 'createRecipe')
                .mockImplementation(() => Promise.resolve({
                    save: () => Promise.resolve({
                        ...reqBody,
                        image: { url: 'some url', public_id: '123' }
                    })
                }));
            uploadToCloudinaryMock = jest.spyOn(cloudinary, 'uploadToCloudinary')
                .mockImplementation(() => Promise.resolve({ url: 'some url', public_id: '123' }));
            getByIdMock = jest.spyOn(restaurantService, 'getById')
                .mockImplementation(() => Promise.resolve({
                    save: () => Promise.resolve({ _id: '123', name: 'Restaurant name' }),
                    owner: '123',
                    recipes: []
                }));
        });

        test('should create recipe and return updated restaurant', async () => {
            const { body, statusCode } = await supertest(app).post('/api/recipe/123/add-recipe')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(200);
            expect(getByIdMock).toHaveBeenCalledTimes(2);
            expect(createRecipeMock).toHaveBeenCalledTimes(1);
            expect(body.recipes.length).toEqual(1);
        });

        test('should throw error if no image', async () => {
            jest.spyOn(parseForm, 'getFormData').mockImplementation(() => Promise.resolve([reqBody, []]));

            const { body, statusCode } = await supertest(app).post('/api/recipe/123/add-recipe')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('At least one image is required!');
        });

        test('should throw error if name length is < 5', async () => {
            reqBody.name = '';
            const { body, statusCode } = await supertest(app).post('/api/recipe/123/add-recipe')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Recipe name must be at least 5 characters long!');
        });

        test('should throw error if ingredients length is < 3', async () => {
            reqBody.ingredients = JSON.stringify([]);
            const { body, statusCode } = await supertest(app).post('/api/recipe/123/add-recipe')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Recipe ingredients must be at last 3!');
        });

        test('should throw error if no price', async () => {
            reqBody.price = '';
            const { body, statusCode } = await supertest(app).post('/api/recipe/123/add-recipe')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Price is required!');
        });

        test('should throw error if no weight', async () => {
            reqBody.weight = '';
            const { body, statusCode } = await supertest(app).post('/api/recipe/123/add-recipe')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Weight is required!');
        });

        test('should throw error if no category', async () => {
            reqBody.category = '';
            const { body, statusCode } = await supertest(app).post('/api/recipe/123/add-recipe')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Category is required!');
        });
    });

    describe('PUT /:recipeId/:restaurantId', () => {
        let reqBody;
        let token;
        let createRecipeMock;
        let uploadToCloudinaryMock;
        let getByIdMock;
        let getRecipeByIdMock;

        beforeEach(() => {
            reqBody = {
                name: 'Recipe name',
                category: 'category',
                price: '3.99',
                weight: '399',
                ingredients: JSON.stringify(['ingredient 1', 'ingredient 2', 'ingredient 3']),
            }
            token = createToken({ email: 'pesho@abv.bg', id: '123' });
            jest.spyOn(parseForm, 'getFormData').mockImplementation(() => Promise.resolve([reqBody, [file]]));
            createRecipeMock = jest.spyOn(recipeService, 'createRecipe')
                .mockImplementation(() => Promise.resolve({
                    save: () => Promise.resolve({
                        ...reqBody,
                        image: { url: 'some url', public_id: '123' }
                    })
                }));
            uploadToCloudinaryMock = jest.spyOn(cloudinary, 'uploadToCloudinary')
                .mockImplementation(() => Promise.resolve({ url: 'some url', public_id: '123' }));
            getByIdMock = jest.spyOn(restaurantService, 'getById')
                .mockImplementation(() => Promise.resolve({
                    save: () => Promise.resolve({ _id: '123', name: 'Restaurant name' }),
                    owner: '123',
                    recipes: []
                }));
            getRecipeByIdMock = jest.spyOn(recipeService, 'getRecipeById')
                .mockImplementation(() => Promise.resolve({
                    save: () => Promise.resolve({}),
                    _id: '123',
                    image: {
                        url: 'url',
                        public_id: 'id'
                    }
                }));
            deleteFromCloudinaryMock = jest.spyOn(cloudinary, 'deleteFromCloudinary')
                .mockImplementation(() => Promise.resolve({}));
        });

        test('should edit recipe and return updated restaurant', async () => {
            const { statusCode } = await supertest(app).put('/api/recipe/123/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(200);
            expect(getByIdMock).toHaveBeenCalledTimes(2);
        });

        test('should throw error if no image', async () => {
            jest.spyOn(parseForm, 'getFormData').mockImplementation(() => Promise.resolve([reqBody, []]));

            const { body, statusCode } = await supertest(app).put('/api/recipe/123/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('At least one image is required!');
        });

        test('should throw error if name length is < 5', async () => {
            reqBody.name = '';
            const { body, statusCode } = await supertest(app).put('/api/recipe/123/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Recipe name must be at least 5 characters long!');
        });

        test('should throw error if ingredients length is < 3', async () => {
            reqBody.ingredients = JSON.stringify([]);
            const { body, statusCode } = await supertest(app).put('/api/recipe/123/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Recipe ingredients must be at last 3!');
        });

        test('should throw error if no price', async () => {
            reqBody.price = '';
            const { body, statusCode } = await supertest(app).put('/api/recipe/123/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Price is required!');
        });

        test('should throw error if no weight', async () => {
            reqBody.weight = '';
            const { body, statusCode } = await supertest(app).put('/api/recipe/123/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Weight is required!');
        });

        test('should throw error if no category', async () => {
            reqBody.category = '';
            const { body, statusCode } = await supertest(app).put('/api/recipe/123/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Category is required!');
        });
    });

    describe('DELETE /:recipeId/:restaurantId', () => {
        let reqBody;
        let token;
        let getByIdMock;
        let deleteByIdMock;

        beforeEach(() => {
            token = createToken({ email: 'pesho@abv.bg', id: '123321' });
            getByIdMock = jest.spyOn(restaurantService, 'getById')
                .mockImplementation(() => Promise.resolve({
                    save: () => Promise.resolve({ _id: '123', name: 'Restaurant name' }),
                    owner: '123321',
                    recipes: [{ _id: '123', image: { public_id: 'id' } }]
                }));
            deleteFromCloudinaryMock = jest.spyOn(cloudinary, 'deleteFromCloudinary')
                .mockImplementation(() => Promise.resolve({}));
            deleteByIdMock = jest.spyOn(recipeService, 'deleteById')
                .mockImplementation(() => Promise.resolve({}));
        });

        test('should delete recipe', async () => {
            const { body, statusCode } = await supertest(app).delete('/api/recipe/123/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(200);
            expect(body.recipes.length).toEqual(0);
            expect(deleteFromCloudinaryMock).toHaveBeenCalledTimes(1);
            expect(deleteByIdMock).toHaveBeenCalledTimes(1);
        });

        test('should throw in case of db error', async () => {
            deleteByIdMock = jest.spyOn(recipeService, 'deleteById')
                .mockImplementation(() => Promise.reject({ message: 'db error' }));
                
            const { body, statusCode } = await supertest(app).delete('/api/recipe/123/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('db error');
        });
    });
});