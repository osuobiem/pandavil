import { DateTime } from "luxon";
import { BaseModel, column, hasMany, HasMany } from "@ioc:Adonis/Lucid/Orm";
import Movie from "App/Models/Movie";

export default class Source extends BaseModel {
  // Relationships
  @hasMany(() => Movie)
  public movies: HasMany<typeof Movie>;

  // Columns
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public url: string;

  @column()
  public moviesUrl: string;

  @column()
  public seriesUrl: string;

  @column()
  public searchUrl: string;

  @column()
  public methodName: string;

  @column()
  public status: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
