import knex from "knex";

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
}


export const getUserOrganizations = async (req, res) => {
    const createdBy = req.user.sub;
    try {
        const organizations = await knex('organizations').select().where({ created_by: createdBy});
        res.json(organizations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

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
}
