<<<<<<< HEAD
import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";

export default class MovieSeeder extends BaseSeeder {
  public async run() {
    // Add sources to db
    await Source.createMany([
      {
        title: "IMDB",
        url: "https://imdb.com",
        moviesUrl: "https://imdb.com/jackiechan",
        status: 1,
      },
      {
        title: "T&C",
        url: "https://t&c.com",
        moviesUrl: "https://t&c.com/jackiechan",
        status: 0,
      },
      {
        title: "Bonefied",
        url: "https://bonefied.com",
        moviesUrl: "https://bonefied.com/jackiechan",
        status: 0,
      },
      {
        title: "Muse",
        url: "https://muse.com",
        moviesUrl: "https://muse.com/jackiechan",
        status: 0,
      },
      {
        title: "Bliss",
        url: "https://bliss.com",
        moviesUrl: "https://bliss.com/jackiechan",
        status: 0,
      },
    ]);
=======
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class MovieSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
>>>>>>> 4b2ddd7f2835b3293f3e1588afd0c1a7594561c6
  }
}
