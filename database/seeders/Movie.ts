import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Movie from "App/Models/Movie";

export default class MovieSeeder extends BaseSeeder {
  public async run() {
    // Add fake movies to the database
    await Movie.createMany([
    ]);
  }
}
