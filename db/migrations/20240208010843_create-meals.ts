import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.uuid('userId').notNullable()
    table.text('mealName').notNullable()
    table.text('dateAndTime').defaultTo(knex.fn.now()).notNullable()
    table.text('description').notNullable()
    table.boolean('onDiet').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
