import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MovieGenres extends BaseSchema {
  protected tableName = 'movie_genres'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('movie_id').unsigned()
      table.foreign('movie_id').references('movies.id').onDelete('CASCADE')
      table.integer('genre_id').unsigned()
      table.foreign('genre_id').references('genres.id').onDelete('CASCADE')
      table.unique(['movie_id', 'genre_id'])

      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
