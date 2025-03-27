import knex from '../database/connection.js';

/**
 * @swagger
 * /api/workspaces/organization/{organizationId}:
 *   post:
 *     summary: Create a new workspace
 *     description: Creates a new workspace within the specified organization for the authenticated user.
 *     tags:
 *       - Workspaces
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the organization.
 *     requestBody:
 *       required: true
 *       description: Workspace object that needs to be created.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My Workspace"
 *     responses:
 *       201:
 *         description: Workspace created successfully.
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
 *                   example: "My Workspace"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
export const createWorkspace = async (req, res) => {
    const { name } = req.body;
    const { organizationId } = req.params;
    const createdBy = req.user.sub;
    try {
        const [workspace] = await knex('workspaces')
            .insert({
                name,
                created_by: createdBy,
                organization_id: organizationId,
            })
            .returning(['id', 'name']);
        res.status(201).json(workspace);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
