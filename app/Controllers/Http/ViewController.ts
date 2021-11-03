import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Movie from "App/Models/Movie";
import Genre from "App/Models/Genre";

export default class ViewController {
  /**
   * Home Page
   */
  public async home({ request, view }: HttpContextContract) {
    const page = request.input("page", 1);
    const movies = await Movie.query().orderBy("id", "desc").paginate(page, 18);
    const genres = await Genre.all();
    const filter = { genre: "*", year: 2020 };

    movies.baseUrl("/");

    return view.render("home", {
      movies,
      genres,
      page: movies.currentPage,
      filter,
    });
  }

  /**
   * Movie Page
   */
  public async movie({ view, params }: HttpContextContract) {
    const movie = await Movie.findByOrFail("movie_slug", params.slug);

    return view.render("movie", { movie });
  }
}
