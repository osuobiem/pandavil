import { DateTime } from "luxon";
import { BaseModel, column, hasMany, HasMany } from "@ioc:Adonis/Lucid/Orm";
import Movie from "App/Models/Movie";

export default class MovieYear extends BaseModel {
  @hasMany(() => Movie)
  public movies: HasMany<typeof Movie>;

  @column({ isPrimary: true })
  public id: number;

  @column()
  public year: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
