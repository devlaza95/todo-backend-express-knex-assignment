/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.createTable('boards', function (table) {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.string('name').notNullable().index('boards_name_index');
        table.uuid('workspace_id').references('id').inTable('workspaces').onDelete('CASCADE').notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
   return knex.schema.dropTable('boards');
};
