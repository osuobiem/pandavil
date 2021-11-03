import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Movie from "App/Models/Movie";

export default class Genre extends BaseModel {
  // Relationships
  @manyToMany(() => Movie, {
    pivotTable: "movie_genres",
  })
  public movies: ManyToMany<typeof Movie>;

  // Columns
  @column({ isPrimary: true })
  public id: number;

  @column()
  public genre: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
