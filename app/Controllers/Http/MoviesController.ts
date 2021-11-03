import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import SourcesService from "@ioc:Pandavil/SourcesService";
import Sources from "@ioc:Pandavil/SourcesService";
import Movie from "App/Models/Movie";
import MovieGenre from "App/Models/MovieGenre";
import Source from "App/Models/Source";
import Genre from "App/Models/Genre";
import LoggerService from "@ioc:Pandavil/LoggerService";
import Log from "App/Models/Log";

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
      // Redirect to home page if the "All genre filter"  option is selected
      if (request.input("genre") == "*") {
        response.redirect().toPath("/");
      }

      const page = request.input("page", 1);
      const filter = { genre: request.input("genre"), year: 2020 };

      // Fetch all genres for filter
      const genres = await Genre.all();

      const genre = await Genre.findOrFail(filter.genre);

      // Lazy load movies of these genre
      const movies = await genre
        .related("movies")
        .query()
        .orderBy("id", "desc")
        .paginate(page, 18);

      movies.baseUrl("/filter");

      return view.render("filter", {
        movies,
        genres,
        page: movies.currentPage,
        filter,
      });
    } catch (error) {
      await LoggerService.error("Genre update error", error, new Log());
    }
  }
}
