import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Series extends BaseSchema {
  protected tableName = 'series'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title')
      table.string('url')
      table.integer('number_of_seasons')
      table.text('image_url')
      table.text('banner_url')
      table.text('description', 'longtext')
      table.text('slug')
      table.string('rating')
      table.string('year')
      table.boolean('status').defaultTo(true)

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
