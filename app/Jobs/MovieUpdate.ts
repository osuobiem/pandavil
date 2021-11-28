import LoggerService from '@ioc:Pandavil/LoggerService';
import SourcesService from '@ioc:Pandavil/SourcesService';
import { JobContract } from '@ioc:Rocketseat/Bull'
import Genre from 'App/Models/Genre';
import Log from 'App/Models/Log';
import Movie from 'App/Models/Movie';
import MovieGenre from 'App/Models/MovieGenre';

/*
|--------------------------------------------------------------------------
| Job setup
|--------------------------------------------------------------------------
|
| This is the basic setup for creating a job, but you can override
| some settings.
|
| You can get more details by looking at the bullmq documentation.
| https://docs.bullmq.io/
*/

export default class MovieUpdate implements JobContract {
  public key = 'MovieUpdate'

  public async handle(job) {
    try {
      let { data } = job
      let new_movies = await SourcesService.netnaija(data.source, Movie);

      if (new_movies != false) {
        for (const key in new_movies) {
          if (Object.prototype.hasOwnProperty.call(new_movies, key)) {
            let m = new_movies[key];

            let genres = m.genres;
            delete m.genres;

            let new_movie = await new Movie().fill(m).save();
            let movie = await Movie.findBy('movie_slug', m.movieSlug);

            [...genres].forEach(async (genre, index) => {
              let db_genre = await Genre.findBy("genre", genre);

              if (!db_genre) {
                let new_genre = await new Genre().fill({ genre }).save();
                db_genre = await Genre.findBy("genre", genre);
              }

              await new MovieGenre().fill({ movieId: movie?.id, genreId: db_genre?.id }).save();
            });

            LoggerService.info(
              "MovieUpdate Job Run",
              "New Movie Updated",
              new Log()
            );
          }
        }
      }
      else {
        LoggerService.info("MovieUpdate Job Run", 'No Movie Updated', new Log());
      }
    } catch (error) {
      await LoggerService.error("MovieUpdate Job Error", error, new Log());
    }
  }
}
