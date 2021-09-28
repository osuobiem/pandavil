import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Genres extends BaseSchema {
  protected tableName = 'genres'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('genre')

      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
