import knex from '../database/connection.js';


/**
 * @swagger
 * /api/organizations:
 *   post:
 *     summary: Create a new organization
 *     description: Creates a new organization for the authenticated user.
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Organization object that needs to be created.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Acme Corp"
 *     responses:
 *       201:
 *         description: Organization created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 name:
 *                   type: string
 *                   example: "Acme Corp"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export const createOrganization = async (req, res) => {
    const createdBy = req.user.sub;
    try {
        const { name } = req.body;
        const [organization] = await knex('organizations').insert({
            name,
            created_by: createdBy,
        }).returning(['id', 'name']);

        res.status(201).json(organization);
    } catch (error){
        res.status(500).json({ error: error.message });
    }
};

/**
 * @swagger
 * /api/organizations:
 *   get:
 *     summary: Get organizations for the authenticated user
 *     description: Retrieves all organizations created by the authenticated user.
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of organizations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   name:
 *                     type: string
 *                     example: "Acme Corp"
 *                   created_by:
 *                     type: string
 *                     format: uuid
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export const getUserOrganizations = async (req, res) => {
    const createdBy = req.user.sub;
    try {
        const organizations = await knex('organizations').select().where({ created_by: createdBy });
        res.json(organizations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @swagger
 * /api/organizations/{id}:
 *   get:
 *     summary: Get a specific organization
 *     description: Retrieves a specific organization by its UUID for the authenticated user.
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The organization UUID.
 *     responses:
 *       200:
 *         description: Organization found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 name:
 *                   type: string
 *                   example: "Acme Corp"
 *                 created_by:
 *                   type: string
 *                   format: uuid
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *       404:
 *         description: Organization not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Organization not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export const getUserOrganization = async (req, res) => {
    const createdBy = req.user.sub;
    const { id } = req.params;
    try {
        const organization = await knex('organizations').select().where({ created_by: createdBy, id }).first();
        if (!organization) {
            return res.status(404).json({ error: 'Organization not found' });
        }
        res.status(200).json(organization);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

