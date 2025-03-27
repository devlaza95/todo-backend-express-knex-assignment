/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.createTable('tasks', function (table) {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.string('title').notNullable().index('tasks_title_index');
        table.text('description');
        table.string('status').defaultTo('todo').index('tasks_status_index');
        table.string('priority').defaultTo('low').index('tasks_priority_index');
        table.uuid('created_by').references('id').inTable('users').onDelete('CASCADE').notNullable();
        table.uuid('board_id').references('id').inTable('boards').onDelete('CASCADE').notNullable();
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
