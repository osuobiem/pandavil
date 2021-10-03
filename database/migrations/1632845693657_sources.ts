import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Sources extends BaseSchema {
  protected tableName = 'sources'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title')
      table.text('url')
      table.text('movies_url').nullable()
      table.text('series_url').nullable()
      table.text('search_url').nullable()
      table.string('method_name')
      table.string('type').defaultTo('movie-source')
      table.boolean('status').defaultTo(false)

      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
