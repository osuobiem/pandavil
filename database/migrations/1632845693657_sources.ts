import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Sources extends BaseSchema {
  protected tableName = 'sources'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title')
      table.text('url')
      table.text('movies_url')
      table.text('series_url')
      table.text('search_url')
      table.string('method_name')
      table.boolean('status').defaultTo(false)

      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
