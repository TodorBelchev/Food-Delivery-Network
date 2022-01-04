const express = require('express');
const supertest = require('supertest');
const bcrypt = require('bcrypt');

const expressSetup = require('../config/express');
const userService = require('../services/userService');
const { SALT_ROUNDS } = require('../config');
const { createToken } = require('../utils');

const app = express();
expressSetup(app);

jest.mock('../services/userService', () => {
    return {
        getUserByEmail: jest.fn(),
        createUser: jest.fn(),
        editUserById: jest.fn(),
        getUserById: jest.fn(),
    }
});

describe('User controller', () => {
    describe('POST /register', () => {
        test('should save user', async () => {
            const reqBody = { email: 'pesho@abv.bg', password: '123123', rePassword: '123123' };
            const getUserByEmailServiceMock = jest.spyOn(userService, 'getUserByEmail')
                .mockImplementation(() => Promise.resolve(null));
            const registerUserServiceMock = jest.spyOn(userService, 'createUser')
                .mockImplementation(() => Promise.resolve({ email: 'pesho@abv.bg', _id: '123' }));
            const { body, statusCode, headers } = await supertest(app).post('/api/user/register').send(reqBody);
            const authCookie = headers['set-cookie'].some(x => x.startsWith('X-Authorization='));

            expect(statusCode).toEqual(200);
            expect(getUserByEmailServiceMock).toHaveBeenCalledTimes(1);
            expect(registerUserServiceMock).toHaveBeenCalledWith('pesho@abv.bg', expect.any(String));
            expect(body).toEqual({ email: 'pesho@abv.bg', _id: '123' });
            expect(authCookie).toBeDefined();
        });

        test('should throw if email is invalid', async () => {
            const reqBody = { email: 'pesho', password: '123123', rePassword: '123123' };
            const getUserByEmailServiceMock = jest.spyOn(userService, 'getUserByEmail')
                .mockImplementation(() => Promise.resolve(null));
            const registerUserServiceMock = jest.spyOn(userService, 'createUser')
                .mockImplementation(() => Promise.resolve({ email: 'pesho@abv.bg', _id: '123' }));
            const { body, statusCode } = await supertest(app).post('/api/user/register').send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Invalid email!');
            expect(getUserByEmailServiceMock).toHaveBeenCalledTimes(0);
            expect(registerUserServiceMock).toHaveBeenCalledTimes(0);
        });

        test('should throw if password length is less than 6', async () => {
            const reqBody = { email: 'pesho@abv.bg', password: '123', rePassword: '123' };
            const getUserByEmailServiceMock = jest.spyOn(userService, 'getUserByEmail')
                .mockImplementation(() => Promise.resolve(null));
            const registerUserServiceMock = jest.spyOn(userService, 'createUser')
                .mockImplementation(() => Promise.resolve({ email: 'pesho@abv.bg', _id: '123' }));
            const { body, statusCode } = await supertest(app).post('/api/user/register').send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Password must be at least 6 characters long!');
            expect(getUserByEmailServiceMock).toHaveBeenCalledTimes(0);
            expect(registerUserServiceMock).toHaveBeenCalledTimes(0);
        });

        test('should throw if passwords does not match', async () => {
            const reqBody = { email: 'pesho@abv.bg', password: '123123', rePassword: '123321' };
            const getUserByEmailServiceMock = jest.spyOn(userService, 'getUserByEmail')
                .mockImplementation(() => Promise.resolve(null));
            const registerUserServiceMock = jest.spyOn(userService, 'createUser')
                .mockImplementation(() => Promise.resolve({ email: 'pesho@abv.bg', _id: '123' }));
            const { body, statusCode } = await supertest(app).post('/api/user/register').send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Passwords must match!');
            expect(getUserByEmailServiceMock).toHaveBeenCalledTimes(0);
            expect(registerUserServiceMock).toHaveBeenCalledTimes(0);
        });

        test('should throw if email is already registered', async () => {
            const reqBody = { email: 'pesho@abv.bg', password: '123123', rePassword: '123123' };
            const getUserByEmailServiceMock = jest.spyOn(userService, 'getUserByEmail')
                .mockImplementation(() => Promise.resolve(true));
            const registerUserServiceMock = jest.spyOn(userService, 'createUser')
                .mockImplementation(() => Promise.resolve({ email: 'pesho@abv.bg', _id: '123' }));
            const { body, statusCode } = await supertest(app).post('/api/user/register').send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Email already registered!');
            expect(getUserByEmailServiceMock).toHaveBeenCalledTimes(1);
            expect(registerUserServiceMock).toHaveBeenCalledTimes(0);
        });
    });

    describe('POST /login', () => {
        test('should log the user', async () => {
            const reqBody = { email: 'pesho@abv.bg', password: '123123' };
            const hashedPassword = await bcrypt.hash(reqBody.password, SALT_ROUNDS);
            const getUserByEmailServiceMock = jest.spyOn(userService, 'getUserByEmail')
                .mockImplementation(() => Promise.resolve({ email: 'pesho@abv.bg', _id: '123', password: hashedPassword }));
            const { body, statusCode, headers } = await supertest(app).post('/api/user/login').send(reqBody);
            const authCookie = headers['set-cookie'].some(x => x.startsWith('X-Authorization='));

            expect(statusCode).toEqual(200);
            expect(getUserByEmailServiceMock).toHaveBeenCalledTimes(1);
            expect(body).toEqual({ email: 'pesho@abv.bg', _id: '123' });
            expect(authCookie).toBeDefined();
        });

        test('should throw if email is invalid', async () => {
            const reqBody = { email: 'pesho', password: '123123' };
            const getUserByEmailServiceMock = jest.spyOn(userService, 'getUserByEmail')
                .mockImplementation(() => Promise.resolve(null));
            const { body, statusCode } = await supertest(app).post('/api/user/login').send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Invalid email!');
            expect(getUserByEmailServiceMock).toHaveBeenCalledTimes(0);
        });

        test('should throw if password length is less than 6', async () => {
            const reqBody = { email: 'pesho@abv.bg', password: '123' };
            const getUserByEmailServiceMock = jest.spyOn(userService, 'getUserByEmail')
                .mockImplementation(() => Promise.resolve(null));
            const { body, statusCode } = await supertest(app).post('/api/user/login').send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Password must be at least 6 characters long!');
            expect(getUserByEmailServiceMock).toHaveBeenCalledTimes(0);
        });

        test('should throw if user does not exists', async () => {
            const reqBody = { email: 'pesho@abv.bg', password: '123123' };
            const getUserByEmailServiceMock = jest.spyOn(userService, 'getUserByEmail')
                .mockImplementation(() => Promise.resolve(null));
            const { body, statusCode } = await supertest(app).post('/api/user/login').send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Invalid credentials!');
            expect(getUserByEmailServiceMock).toHaveBeenCalledTimes(1);
        });

        test('should throw if password does not match', async () => {
            const reqBody = { email: 'pesho@abv.bg', password: '123123' };
            const getUserByEmailServiceMock = jest.spyOn(userService, 'getUserByEmail')
                .mockImplementation(() => Promise.resolve({ email: 'pesho@abv.bg', _id: '123', password: '#somehash$' }));
            const { body, statusCode } = await supertest(app).post('/api/user/login').send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Invalid credentials!');
            expect(getUserByEmailServiceMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('PUT /:id', () => {
        test('should edit user', async () => {
            const reqBody = {
                email: 'pesho@abv.bg',
                firstName: 'Pesho',
                lastName: 'Petrov',
                city: 'Sofia',
                address: 'Some address',
                phone: '0999999999'
            }
            const token = createToken({ email: 'pesho@abv.bg', id: '123' });
            const editUserByIdMock = jest.spyOn(userService, 'editUserById')
                .mockImplementation(() => Promise.resolve({ ...reqBody, _id: '123' }));
            const { statusCode } = await supertest(app).put('/api/user/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(200);
            expect(editUserByIdMock).toHaveBeenCalledTimes(1);
        });

        test('should throw error if user is not authorized', async () => {
            const reqBody = {
                email: 'pesho@abv.bg',
                firstName: 'Pesho',
                lastName: 'Petrov',
                city: 'Sofia',
                address: 'Some address',
                phone: '0999999999'
            }
            const token = createToken({ email: 'pesho@abv.bg', id: '123' });
            const editUserByIdMock = jest.spyOn(userService, 'editUserById')
                .mockImplementation(() => Promise.resolve({ ...reqBody, _id: '123' }));
            const { statusCode } = await supertest(app).put('/api/user/123456')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(editUserByIdMock).toHaveBeenCalledTimes(0);
        });

        test('should throw error if first name length < 4', async () => {
            const reqBody = {
                email: 'pesho@abv.bg',
                firstName: 'Pe',
                lastName: 'Petrov',
                city: 'Sofia',
                address: 'Some address',
                phone: '0999999999'
            }
            const token = createToken({ email: 'pesho@abv.bg', id: '123' });
            const editUserByIdMock = jest.spyOn(userService, 'editUserById')
                .mockImplementation(() => Promise.resolve({ ...reqBody, _id: '123' }));
            const { body, statusCode } = await supertest(app).put('/api/user/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('First name must be at least 4 characters long!');
            expect(editUserByIdMock).toHaveBeenCalledTimes(0);
        });

        test('should throw error if last name length < 4', async () => {
            const reqBody = {
                email: 'pesho@abv.bg',
                firstName: 'Pesho',
                lastName: 'Pe',
                city: 'Sofia',
                address: 'Some address',
                phone: '0999999999'
            }
            const token = createToken({ email: 'pesho@abv.bg', id: '123' });
            const editUserByIdMock = jest.spyOn(userService, 'editUserById')
                .mockImplementation(() => Promise.resolve({ ...reqBody, _id: '123' }));
            const { body, statusCode } = await supertest(app).put('/api/user/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Last name must be at least 4 characters long!');
            expect(editUserByIdMock).toHaveBeenCalledTimes(0);
        });

        test('should throw error if city length < 4', async () => {
            const reqBody = {
                email: 'pesho@abv.bg',
                firstName: 'Pesho',
                lastName: 'Petrov',
                city: 'So',
                address: 'Some address',
                phone: '0999999999'
            }
            const token = createToken({ email: 'pesho@abv.bg', id: '123' });
            const editUserByIdMock = jest.spyOn(userService, 'editUserById')
                .mockImplementation(() => Promise.resolve({ ...reqBody, _id: '123' }));
            const { body, statusCode } = await supertest(app).put('/api/user/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('City must be at least 4 characters long!');
            expect(editUserByIdMock).toHaveBeenCalledTimes(0);
        });

        test('should throw error if address length < 4', async () => {
            const reqBody = {
                email: 'pesho@abv.bg',
                firstName: 'Pesho',
                lastName: 'Petrov',
                city: 'Sofia',
                address: 'Som',
                phone: '0999999999'
            }
            const token = createToken({ email: 'pesho@abv.bg', id: '123' });
            const editUserByIdMock = jest.spyOn(userService, 'editUserById')
                .mockImplementation(() => Promise.resolve({ ...reqBody, _id: '123' }));
            const { body, statusCode } = await supertest(app).put('/api/user/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Address must be at least 4 characters long!');
            expect(editUserByIdMock).toHaveBeenCalledTimes(0);
        });

        test('should throw error if email is not valid', async () => {
            const reqBody = {
                email: 'pesho',
                firstName: 'Pesho',
                lastName: 'Petrov',
                city: 'Sofia',
                address: 'Some address',
                phone: '0999999999'
            }
            const token = createToken({ email: 'pesho@abv.bg', id: '123' });
            const editUserByIdMock = jest.spyOn(userService, 'editUserById')
                .mockImplementation(() => Promise.resolve({ ...reqBody, _id: '123' }));
            const { body, statusCode } = await supertest(app).put('/api/user/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Please enter a valid email!');
            expect(editUserByIdMock).toHaveBeenCalledTimes(0);
        });

        test('should throw error if phone is not valid', async () => {
            const reqBody = {
                email: 'pesho@abv.bg',
                firstName: 'Pesho',
                lastName: 'Petrov',
                city: 'Sofia',
                address: 'Some address',
                phone: '999999999'
            }
            const token = createToken({ email: 'pesho@abv.bg', id: '123' });
            const editUserByIdMock = jest.spyOn(userService, 'editUserById')
                .mockImplementation(() => Promise.resolve({ ...reqBody, _id: '123' }));
            const { body, statusCode } = await supertest(app).put('/api/user/123')
                .set('Cookie', [`X-Authorization=${token}`])
                .send(reqBody);

            expect(statusCode).toEqual(400);
            expect(body.message).toEqual('Please enter a valid phone number!');
            expect(editUserByIdMock).toHaveBeenCalledTimes(0);
        });
    });

    describe('GET /verify', () => {
        test('should return empty object if user is not logged in', async () => {
            const { body, statusCode } = await supertest(app).get('/api/user/verify');

            expect(statusCode).toEqual(200);
            expect(body).toEqual({});
        });

        test('should return user details if user is logged in', async () => {
            const resBody = { _id: '123', email: 'pesho@abv.bg' };
            const token = createToken({ email: 'pesho@abv.bg', id: '123' });
            const getUserByIdMock = jest.spyOn(userService, 'getUserById')
                .mockImplementation(() => Promise.resolve(resBody));
            const { body, statusCode } = await supertest(app).get('/api/user/verify')
                .set('Cookie', [`X-Authorization=${token}`]);

            expect(statusCode).toEqual(200);
            expect(body).toEqual(resBody);
            expect(getUserByIdMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /logout', () => {
        test('should clear cookie', async () => {
            const token = createToken({ email: 'pesho@abv.bg', id: '123' });
            const { body, statusCode, headers } = await supertest(app).get('/api/user/logout')
                .set('Cookie', [`X-Authorization=${token}`]);
            const authCookie = headers['set-cookie'].some(x => x.startsWith('X-Authorization='));

            expect(statusCode).toEqual(200);
            expect(authCookie).toBeDefined();
            expect(body.message).toEqual('Logged out');
        });
    });
});