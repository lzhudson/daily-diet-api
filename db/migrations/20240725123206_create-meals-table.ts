import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.text('date_and_hour').notNullable()
    table.boolean('in_the_diet').notNullable()
    table.uuid('user_id').unsigned().notNullable()
    table.foreign('user_id').references('id').inTable('users')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('meals')
}
