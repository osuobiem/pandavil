import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Source from "App/Models/Source";
import Movie from "App/Models/Movie";
import { logger } from "Config/app";
import Logger from "@ioc:Adonis/Core/Logger";
import Bull from "@ioc:Rocketseat/Bull";
import AutoSourceChecker from "App/Jobs/AutoSourceChecker";
import MovieUpdate from "App/Jobs/MovieUpdate";
import LoggerService from "@ioc:Pandavil/LoggerService";
import Log from "App/Models/Log";
import MovieGenre from "App/Models/MovieGenre";
import Genre from "App/Models/Genre";

import Sources from "@ioc:Pandavil/SourcesService";
import SourcesService from "@ioc:Pandavil/SourcesService";

export default class SourcesController {
  public async index({ request, response, view }: HttpContextContract) {
    // return response.send({ data: await this.autoSourceChecker() });
  }

  /**
   * Dispatches the job that checks movie sources every day at 2:00 AM and updates them accordingly
   */
  public async dispatchAutoSourceChecker() {
    try {
      // Dispatch Job that should be executed everyday at (2:00 AM)
      await Bull.add(new AutoSourceChecker().key, null, {
        repeat: {
          cron: "00 2 * * *", // 2:00 AM daily
        },
      });

      await LoggerService.info(
        "Job info",
        "AutoSourceChecker Job dispatched",
        new Log()
      );
    } catch (error) {
      await LoggerService.error("Job error", error, new Log());
    }
  }

  /**
   * Dispatches the job that updates movies on the platform
   */
  public async dispatchMovieUpdate() {
    // try {
    //   let source: any = await Source.findBy("method_name", "netnaija");

    //   // Dispatch Job that should be executed every 30 min
    //   await LoggerService.info(
    //     "Movie Job Info",
    //     "Movie Update Job Dispatch Attempt",
    //     new Log()
    //   );

    //   await Bull.add(
    //     new MovieUpdate().key,
    //     { source },
    //     {
    //       repeat: {
    //         cron: "*/2 * * * *", // Every 30 Minutes
    //       },
    //     }
    //   );
    // } catch (error) {
    //   await LoggerService.error("Job error", error, new Log());
    // }
    let source: any = await Source.findBy("method_name", "netnaija");
    let new_movies = await SourcesService.netnaija(source, Movie);

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
  }

  /**
   * Handle changing of movie sources manually and automatically with
   * failedSource param being the old/previous source and manualSource
   * being the source which the admin intends to change to
   *
   * @param oldSource
   * @param newSource
   * @returns boolean
   */
  public async switchSource(oldSource: number, newSource?: number) {
    try {
      // Handle source switching when active source is supplied
      if (newSource == undefined) {
        const sources = await Source.query().orderBy("id", "asc");

        // Check sources to see which is functional
        for (const i in sources) {
          let workingSource: number = sources[i]["id"];

          if (
            sources[i]["id"] != oldSource &&
            (await this.sourceIsWorking(sources[i]["url"]))
          ) {
            // Method call to change source
            this.switch(oldSource, workingSource);

            // Update movies of failed source
            this.updateFailedSourceMovie(oldSource, sources[i]);

            // Break loop
            break;
          }
        }
      } else {
        // Method call to change source based on admin request
        this.switch(oldSource, newSource);
      }

      return true;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }

  /**
   * Implement database update
   *
   * @param oldSource
   * @param newSource
   */
  private async switch(oldSource: number, newSource: number) {
    // Deactivate old source
    const oldSrc = await Source.findOrFail(oldSource);
    oldSrc.status = 0;
    await oldSrc.save();

    // Activate new source
    const newSrc = await Source.findOrFail(newSource);
    newSrc.status = 1;
    await newSrc.save();
  }

  /**
   * Check if source is active
   *
   * @param sourceUrl Source URL
   * @returns true if active, false if otherwise
   */
  public async sourceIsWorking(sourceUrl: string) {
    return (await Sources.ping_url(sourceUrl)) !== false;
  }

  /**
   * Update necessary information about movies of failed source.
   *
   * @param oldSource
   * @param newSource
   */
  public async updateFailedSourceMovie(oldSource: number, newSource: Source) {
    try {
      // Fetch old source movies
      const movies = await Movie.query()
        .where("source_id", oldSource)
        .orderBy("id", "asc");

      // Loop through movies of failed source and update their source details
      for (const i in movies) {
        // Check if the source has this movie and then update the movie's source data
        if (
          await this.checkIfSourceHasMovie(movies[i]["title"], newSource.url)
        ) {
          await Movie.query()
            .where("id", movies[i]["id"])
            .update({ source_id: newSource.id });
        } else {
          // Look for another source that has the movie
          const sources = await Source.all();

          for (const j in sources) {
            // Change movie source details if the movie exists in the source else deactivate the movie
            if (
              sources[j]["id"] != newSource.id &&
              (await this.checkIfSourceHasMovie(
                movies[i]["title"],
                sources[j]["url"]
              ))
            ) {
              await Movie.query().where("id", movies[i]["id"]).update({
                source_id: sources[j]["id"],
              });
              break;
            } else {
              await Movie.query()
                .where("id", movies[i]["id"])
                .update({ status: 0 });
            }
          }
        }
      }
    } catch (error) {
      Logger.error(error);
    }
  }

  private async checkIfSourceHasMovie(movieTitle: string, sourceUrl: string) {
    return false;
  }

  /**
   * Automatically check all movie sources to ensure functionality
   */
  public async autoSourceChecker() {
    try {
      const sources = await Source.query().orderBy("id", "asc");

      for (const i in sources) {
        if (
          !(await this.sourceIsWorking(sources[i]["url"])) &&
          sources[i]["status"] == 1
        ) {
          // Switch and update source and its movies if source is not working
          await this.switchSource(sources[i]["id"]);
        } else if (
          !(await this.sourceIsWorking(sources[i]["url"])) &&
          sources[i]["status"] == 0
        ) {
          // Check for source that works and pass to method that updates failed source movies
          for (const j in sources) {
            if (
              sources[j]["id"] != sources[i]["id"] &&
              (await this.sourceIsWorking(sources[j]["url"]))
            ) {
              await this.updateFailedSourceMovie(sources[i]["id"], sources[j]);
            }
          }
        }
      }
      return "true";
    } catch (error) {
      Logger.error(error);
      return "false";
    }
  }

  /**
   * Fetch available movie genres
   */
  public async getGenres() {
    const movies = await Movie.all();
    const lastIndex = movies.length - 1;
    let genres: string = "";

    // Loop through to extract genres
    for (const i in movies) {
      if (lastIndex != parseInt(i)) {
        genres += movies[i]["genres"] + "|";
      } else {
        genres += movies[i]["genres"];
      }
    }

    return [...new Set(genres.split("|"))];
  }

  /**
   * Manage movie genres
   */
  public async manageGenres() {
    try {
      const movies = await Movie.all();

      // Loop through to extract genres
      for (const i in movies) {
        // Get the genres of a movie as an array
        let genreArr = movies[i]["genres"].split("|");

        for (const j in genreArr) {
          const genre = await Genre.findBy("genre", genreArr[j]);

          if (genre != null) {
            // Update movie_genre table if genre exists
            await MovieGenre.create({
              movieId: movies[i]["id"],
              genreId: genre.id,
            });
          } else {
            // Create new genre if genre doesnt exist
            const newGenre = await Genre.create({
              genre: genreArr[j],
            });
            // Update movie_genre table if genre exists
            await MovieGenre.create({
              movieId: movies[i]["id"],
              genreId: newGenre.id,
            });
          }
        }
      }
    } catch (error) {
      await LoggerService.error("Genre update error", error, new Log());
    }
  }
}
