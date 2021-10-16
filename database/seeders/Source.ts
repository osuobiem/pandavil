import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Source from "App/Models/Source";

export default class SourceSeeder extends BaseSeeder {
  public async run() {
    // Add sources to db
    await Source.createMany([
      {
        title: "Medeberiyaa",
        url: "https://medeberiyaa.com",
        moviesUrl: "https://medeberiyaa.com/index.php/category/movies/",
        methodName: 'medeberiyaa',
        status: 1,
      }
    ]);
  }
}
