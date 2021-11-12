import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Seasons extends BaseSchema {
  protected tableName = 'seasons'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('number')
      table.integer('number_of_episodes')
      table.integer('series_id').unsigned().notNullable()
      table.foreign('series_id').references('series.id').onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
