import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Episodes extends BaseSchema {
  protected tableName = 'episodes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').nullable()
      table.integer('number')
      table.string('url')
      table.text('download_urls', 'longtext')
      table.text('description', 'longtext')
      table.string('duration')

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
