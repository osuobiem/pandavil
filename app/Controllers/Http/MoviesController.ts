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
  public async filter(request, view, response) {
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
      const genres = await Genre.query().orderBy('genre');
      // Extract all years for filter
      const years = await Database.from("movies")
        .select("year")
        .distinct("year").orderBy('year', 'desc');;

      // Get filter query
      const data = await this.getFilterQuery(filter, page);

      data.movies.baseUrl("/");

      return view.render("home", {
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
    let movies: any = false;
    let urlPar: string = '';

    // Filter by Genre
    if(filter.genre != '*') {
      const genre = await Genre.query().where('genre', filter.genre).firstOrFail();
      
      // Lazy load movies of this genre
      movies = genre.related("movies").query();

      urlPar = `genre=${filter.genre}`;
    }

    // Filter by Year
    if(filter.year != '*') {
      
      if(!movies) {
        movies = Movie.query();
      }

      movies = movies.where("year", filter.year);
      urlPar += !movies ? `year=${filter.year}` : `&year=${filter.year}`;
    }

    movies = movies 
    ? await movies.orderBy("id", "desc").paginate(page, 18) 
    : await Movie.query().orderBy("id", "desc").paginate(page, 18);

    return { movies, urlPar };
  }
}
