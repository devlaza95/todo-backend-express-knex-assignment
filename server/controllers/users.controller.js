import knex from '../database/connection.js';

export const getMe = async (req, res) => {
    try {
        const user = await knex('users').where({ id: req.user.sub }).first();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
