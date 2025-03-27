/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.createTable('workspaces', function (table) {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.string('name').notNullable().index('workspaces_name_index');
        table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE').notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
  return knex.schema.dropTable('workspaces')
};
