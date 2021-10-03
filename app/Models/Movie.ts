import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import MovieYear from "App/Models/MovieYear";
import Source from "App/Models/Source";
import Genre from "App/Models/Genre";

export default class Movie extends BaseModel {
  // Relationships
  @belongsTo(() => MovieYear)
  public movieYears: BelongsTo<typeof MovieYear>;

  @belongsTo(() => Source)
  public sources: BelongsTo<typeof Source>;

  @manyToMany(() => Genre, {
    pivotTable: "movie_genre",
  })
  public genres: ManyToMany<typeof Genre>;

  // Columns
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public rating: string;

  @column()
  public yearId: number;

  @column()
  public duration: string;

  @column()
  public userDiscretion: string;

  @column()
  public trailerUrl: string;

  @column()
  public sourceUrl: string;

  @column()
  public sourceId: number;

  @column()
  public imageUrl: string;

  @column()
  public status: number;

  @column()
  public downloadUrls: string;

  @column()
  public description: string;

  @column()
  public movieSlug: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
