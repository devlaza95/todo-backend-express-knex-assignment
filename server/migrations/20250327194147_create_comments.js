/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.createTable('comments', function (table) {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.text('text').notNullable().index('comments_text_index');
        table.uuid('created_by').references('id').inTable('users').onDelete('CASCADE').notNullable();
        table.uuid('task_id').references('id').inTable('tasks').onDelete('CASCADE').notNullable();
        table.uuid('comment_id').references('id').inTable('comments').onDelete('CASCADE').notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
  return knex.schema.dropTable('comments');
};
