import knex from '../database/connection.js';

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Retrieve the authenticated user's details
 *     description: Returns the details of the user associated with the provided JWT.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The authenticated user's details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user ID.
 *                 name:
 *                   type: string
 *                   description: The user's name.
 *                 email:
 *                   type: string
 *                   description: The user's email address.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */
export const getMe = async (req, res) => {
    try {
        const user = await knex('users').where({ id: req.user.sub }).first();
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
