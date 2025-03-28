import request from 'supertest';
import app from '../server.js';
import knex from '../database/connection.js';
import * as jest from "node/test.js";

// Mock the auth middleware
const mockAuthMiddleware = (req, res, next) => {
    req.user = {
        sub: '550e8400-e29b-41d4-a716-446655440000'
    };
    next();
}

// Temporary replace auth middleware for testing purposes
jest.mock('../middlewares/auth.middleware.js', () => mockAuthMiddleware);


describe('Organizations endpoints', () => {
    let orgnizationId;

    // clear and seed database before tests
    beforeAll(async () => {
        await knex('organizations').del();
    });

    afterAll(async () => {
        await knex('organizations').del();
        await knex.destroy();
    });

    describe('POST /api/organizations', () => {
        it('should create a new organization', async () => {
            const res = await request(app)
                .post('/api/organizations')
                .send({ name: 'Acme Corp' });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('name');
            orgnizationId = res.body.id;
        });
        it('should return 400 if name is missing', async () => {
            const res = await request(app)
                .post('/api/organizations')
                .send({});

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('error');
        })
        it ('should return 500 if database error occurs', async () => {
            const originalKnex = require('../database/connection.js');
            jest.mock('../database/connection.js', () => ({
                ...originalKnex,
                'organizations': {
                    insert: jest.fn().mockRejectedValue(new Error('Database error ocurred.'))
                }
            }));

            const response = await request(app).post('/api/organizations').send({ name: 'Acme Corp' });

            expect(response.statusCode).toEqual(500);
            expect(response.body).toHaveProperty('error');

            jest.unmock('../database/connection.js');
        })
    })

    describe('GET /api/organizations', () => {
        beforeEach(async () => {
            if (!orgnizationId) {
                const org = await knex('organizations').insert({
                    name: 'Test',
                    created_by: '550e8400-e29b-41d4-a716-446655440000'
                }).returning('id');
                orgnizationId = org[0].id;
            }
        })

        it('should return a list of organizations',async () => {
            const res = await request(app).get('/api/organizations');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBeGreaterThan(0);

        });

        it('should return 500 if database error occurs', async () => {
            const originalKnex = require('../database/connection.js');
            jest.mock('../database/connection.js', () => ({
                ...originalKnex,
                'organizations': {
                    select: jest.fn().mockRejectedValue(new Error('Database error ocurred.'))
                }
            }));

            const response = await request(app).get('/api/organizations');

            expect(response.statusCode).toEqual(500);
            expect(response.body).toHaveProperty('error');

            jest.unmock('../database/connection.js');
        })
    })

    describe('GET /api/organizations/:id', () => {
        it('should return a single organization', async () => {
            const res = await request(app).get(`/api/organizations/${orgnizationId}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('name');
        });

        it('should return 404 if organization does not exist', async () => {
            const res = await request(app).get(`/api/organizations/550e8400-e29b-41d4-a716-446655440001`);

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 500 if database error occurs', async () => {
            const originalKnex = require('../database/connection.js');
            jest.mock('../database/connection.js', () => ({
                ...originalKnex,
                'organizations': {
                    select: jest.fn().mockRejectedValue(new Error('Database error ocurred.'))
                }
            }));

            const response = await request(app).get(`/api/organizations/${orgnizationId}`);

            expect(response.statusCode).toEqual(500);
            expect(response.body).toHaveProperty('error');

            jest.unmock('../database/connection.js');
        });
    })
})
