/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', function (table) {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.string('name').notNullable().index('users_name_index');
        table.string('email').notNullable().unique().index('users_email_index');
        table.string('password_hash').notNullable();
        table.string('role').defaultTo('user').index('users_role_index');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users')
};
