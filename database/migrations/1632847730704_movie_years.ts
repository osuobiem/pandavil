import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MovieYears extends BaseSchema {
  protected tableName = 'movie_years'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('year')

      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
