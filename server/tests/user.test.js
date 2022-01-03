const express = require('express');
const supertest = require('supertest');

const expressSetup = require('../config/express');
const userService = require('../services/userService');

const app = express();
expressSetup(app);

jest.mock('../services/userService', () => {
    return {
        getUserByEmail: jest.fn(),
        createUser: jest.fn()
    }
});

describe('User controller', () => {
    describe('POST /register', () => {
        test('should save user', async () => {
            const reqBody = { email: 'pesho@abv.bg', password: '123123', rePassword: '123123' };
            const getUserByEmailServiceMock = jest.spyOn(userService, 'getUserByEmail').mockImplementation(() => Promise.resolve(null));
            const registerUserServiceMock = jest.spyOn(userService, 'createUser').mockImplementation(() => Promise.resolve({ email: 'pesho@abv.bg', _id: '123' }));
            const { body, statusCode } = await supertest(app).post('/api/user/register').send(reqBody);

            expect(statusCode).toEqual(200);
            expect(getUserByEmailServiceMock).toHaveBeenCalledTimes(1);
            expect(registerUserServiceMock).toHaveBeenCalledWith('pesho@abv.bg', expect.any(String));
            expect(body).toEqual({ email: 'pesho@abv.bg', _id: '123' });
        });

        test('should throw if email is invalid', async () => {
            const reqBody = { email: 'pesho', password: '123123', rePassword: '123123' };
            const getUserByEmailServiceMock = jest.spyOn(userService, 'getUserByEmail').mockImplementation(() => Promise.resolve(null));
            const registerUserServiceMock = jest.spyOn(userService, 'createUser').mockImplementation(() => Promise.resolve({ email: 'pesho@abv.bg', _id: '123' }));
            const { body, statusCode } = await supertest(app).post('/api/user/register').send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Invalid email!');
            expect(getUserByEmailServiceMock).toHaveBeenCalledTimes(0);
            expect(registerUserServiceMock).toHaveBeenCalledTimes(0);
        });

        test('should throw if password length is less than 6', async () => {
            const reqBody = { email: 'pesho@abv.bg', password: '123', rePassword: '123' };
            const getUserByEmailServiceMock = jest.spyOn(userService, 'getUserByEmail').mockImplementation(() => Promise.resolve(null));
            const registerUserServiceMock = jest.spyOn(userService, 'createUser').mockImplementation(() => Promise.resolve({ email: 'pesho@abv.bg', _id: '123' }));
            const { body, statusCode } = await supertest(app).post('/api/user/register').send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Password must be at least 6 characters long!');
            expect(getUserByEmailServiceMock).toHaveBeenCalledTimes(0);
            expect(registerUserServiceMock).toHaveBeenCalledTimes(0);
        });

        test('should throw if passwords does not match', async () => {
            const reqBody = { email: 'pesho@abv.bg', password: '123123', rePassword: '123321' };
            const getUserByEmailServiceMock = jest.spyOn(userService, 'getUserByEmail').mockImplementation(() => Promise.resolve(null));
            const registerUserServiceMock = jest.spyOn(userService, 'createUser').mockImplementation(() => Promise.resolve({ email: 'pesho@abv.bg', _id: '123' }));
            const { body, statusCode } = await supertest(app).post('/api/user/register').send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Passwords must match!');
            expect(getUserByEmailServiceMock).toHaveBeenCalledTimes(0);
            expect(registerUserServiceMock).toHaveBeenCalledTimes(0);
        });

        test('should throw if email is already registered', async () => {
            const reqBody = { email: 'pesho@abv.bg', password: '123123', rePassword: '123123' };
            const getUserByEmailServiceMock = jest.spyOn(userService, 'getUserByEmail').mockImplementation(() => Promise.resolve(true));
            const registerUserServiceMock = jest.spyOn(userService, 'createUser').mockImplementation(() => Promise.resolve({ email: 'pesho@abv.bg', _id: '123' }));
            const { body, statusCode } = await supertest(app).post('/api/user/register').send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Email already registered!');
            expect(getUserByEmailServiceMock).toHaveBeenCalledTimes(1);
            expect(registerUserServiceMock).toHaveBeenCalledTimes(0);
        });
    });
});