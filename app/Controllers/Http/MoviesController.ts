import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import SourcesService from "@ioc:Pandavil/SourcesService";
import Sources from "@ioc:Pandavil/SourcesService";
import Movie from "App/Models/Movie";
import MovieGenre from "App/Models/MovieGenre";
import Source from "App/Models/Source";
import Genre from "App/Models/Genre";
import LoggerService from "@ioc:Pandavil/LoggerService";
import Log from "App/Models/Log";
import Database from "@ioc:Adonis/Lucid/Database";

export default class MoviesController {
  /**
   * Generate and return download link for netnaija
   */
  public async get_download_link({ request, response }: HttpContextContract) {
    let download_obj: any = await SourcesService.ping_url(
      request.input("link")
    );

    response.send(download_obj.data.data.url);
  }

  /**
   * Search movies
   */
  public async search({ request, view }: HttpContextContract) {
    const page = request.input("page", 1);
    const keyword: string = request.input("keyword");

    const results: any = await Movie.query()
      .where("title", "like", "%" + keyword + "%")
      .orderBy("id", "desc")
      .paginate(page, 18);

    results.baseUrl("/search");

    return view.render("search-results", {
      results,
      page: results.currentPage,
      keyword,
    });
  }

  /**
   * Movie by categories (Either genres or years)
   */
  public async filter({ request, view, response }: HttpContextContract) {
    try {
      const page = request.input("page", 1);
      const filter = {
        genre: request.input("genre", "*"),
        year: request.input("year", "*"),
      };

      // Early redirect when filters are empty (set to all)
      if (filter.genre == "*" && filter.year == "*") {
        response.redirect().toPath("/");
        return;
      }

      // Fetch all genres for filter
      const genres = await Genre.all();
      // Extract all years for filter
      const years = await Database.from("movies")
        .select("year")
        .distinct("year");

      // Get filter query
      const data = await this.getFilterQuery(filter, page);

      data.movies.baseUrl("/filter");

      return view.render("filter", {
        movies: data.movies,
        genres,
        years,
        page: data.movies.currentPage,
        filter,
        urlPar: data.urlPar,
      });
    } catch (error) {
      await LoggerService.error("Genre update error", error, new Log());
    }
  }

  /**
   * Construct query for the different filter cases
   */
  private async getFilterQuery(filter: any, page: number) {
    let movies: any;
    let urlPar: any;

    // Construct query based on filter selected
    if (filter.genre == "*" && filter.year != "*") {
      movies = await Movie.query()
        .where("year", filter.year)
        .orderBy("id", "desc")
        .paginate(page, 18);
      urlPar = `year=${filter.year}`;
    } else if (filter.genre != "*" && filter.year == "*") {
      const genre = await Genre.findOrFail(filter.genre);

      // Lazy load movies of these genre
      movies = await genre
        .related("movies")
        .query()
        .orderBy("id", "desc")
        .paginate(page, 18);
      urlPar = `genre=${filter.genre}`;
    } else {
      const genre = await Genre.findOrFail(filter.genre);

      // Lazy load movies of these genre
      movies = await genre
        .related("movies")
        .query()
        .where("year", filter.year)
        .orderBy("id", "desc")
        .paginate(page, 18);
      urlPar = `genre=${filter.genre}&year=${filter.year}`;
    }
    return { movies, urlPar };
  }
}
