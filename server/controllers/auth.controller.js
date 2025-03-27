import bcrypt from 'bcrypt';
import knex from '../database/connection.js';
import { jwtService } from '../utils/jwt.service.js';
import redisClient from '../utils/redis-client.js';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const [user] = await knex('users')
            .insert({
                name,
                email,
                role: 'admin',
                password_hash: hash,
            })
            .returning(['id']);

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export const login = async (req, res) => {
    try {
        // Instantiate the JWT service
        const jwtSvc = jwtService();
        const { email, password } = req.body;
        const user = await knex('users').where({ email }).first();

        if (!user) {
            return res.status(400).json({ error: 'User does not exist.' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(400).json({ error: 'Invalid password.' });
        }

        const accessToken = jwtSvc.accessToken({ sub: user.id, email: user.email, role: user.role });
        const refreshToken = jwtSvc.refreshToken({ sub: user.id });

        await redisClient.set(`refresh-token/${user.id}`, refreshToken);
        console.log('test');

        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { userId, refreshToken } = req.body;
        const token = await redisClient.get(`refresh-token/${userId}`);
        if (token !== refreshToken) {
            return res.status(400).json({ error: 'Invalid refresh token.' });
        }

        const jwtSvc = jwtService();
        const newAccessToken = jwtSvc.accessToken({ sub: userId });
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
