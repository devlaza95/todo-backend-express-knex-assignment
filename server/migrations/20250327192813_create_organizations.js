/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.createTable('organizations', function (table) {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.string('name').notNullable().index('organizations_name_index');
        table.uuid('created_by').references('id').inTable('users').onDelete('CASCADE').notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
  return knex.schema.dropTable('organizations')
};
