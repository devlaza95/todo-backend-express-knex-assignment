/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.createTable('workspace_members', function (table) {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.uuid('workspace_id').references('id').inTable('workspaces').onDelete('CASCADE').notNullable();
        table.uuid('member_id').references('id').inTable('users').onDelete('CASCADE').notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema.dropTable('workspace_members');
};
