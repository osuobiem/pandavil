import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Movie from "App/Models/Movie";

export default class MovieSeeder extends BaseSeeder {
  public async run() {
    // Add fake movies to the database
    await Movie.createMany([
      {
        title: "Ruroni kenshin",
        yearId: 1,
        sourceId: 1,
      },
      {
        title: "Scorpion King",
        yearId: 1,
        sourceId: 2,
      },
      {
        title: "Free guy",
        yearId: 1,
        sourceId: 1,
      },
      {
        title: "King of Egypt",
        yearId: 1,
        sourceId: 3,
      },
      {
        title: "The Three Musketeers",
        yearId: 1,
        sourceId: 1,
      },
    ]);
  }
}
