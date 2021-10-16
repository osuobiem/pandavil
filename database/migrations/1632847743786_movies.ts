import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Movies extends BaseSchema {
  protected tableName = 'movies'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('title')
      table.string('rating')
      table.string('year')
      table.string('duration')
      table.text('genres')
      table.text('trailer_url')
      table.text('source_url')
      table.integer('source_id').unsigned().notNullable()
      table.foreign('source_id').references('sources.id').onDelete('CASCADE')
      table.text('image_url')
      table.text('banner_url')
      table.text('download_urls', 'longtext')
      table.text('description', 'longtext')
      table.text('movie_slug')
      table.boolean('status').defaultTo(true)

      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
