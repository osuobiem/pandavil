import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Movie from "App/Models/Movie";
import Genre from "App/Models/Genre";
import MovieYear from "App/Models/MovieYear";
import Database from "@ioc:Adonis/Lucid/Database";
import MoviesController from "./MoviesController";

export default class ViewController {
  /**
   * Home Page
   */
  public async home({ request, view, response }: HttpContextContract) {
    // Check for filters
    if(request.input('genre') || request.input('year')) {
      return await (new MoviesController).filter(request, view, response);
    }

    const page = request.input("page", 1);
    const movies = await Movie.query().orderBy("id", "desc").paginate(page, 18);
    const genres = await Genre.query().orderBy('genre');
    const years = await Database.from("movies").select("year").distinct("year").orderBy('year', 'desc');
    const filter = { genre: "*", year: "*" };

    movies.baseUrl("/");

    return view.render("home", {
      movies,
      genres,
      years,
      page: movies.currentPage,
      filter,
      urlPar: ''
    });
  }

  /**
   * Movie Page
   */
  public async movie({ view, params }: HttpContextContract) {
    const movie = await Movie.findByOrFail("movie_slug", params.slug);
    const genres = await movie.related('genres').query();

    return view.render("movie", { movie, genres });
  }
}
