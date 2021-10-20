import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Movie from 'App/Models/Movie'

export default class ViewController {

    /**
     * Home Page
     */
    public async home({request, view}: HttpContextContract) {
        const page = request.input('page', 1)
        const movies = await Movie.query().orderBy('id', 'desc').paginate(page, 18);

        movies.baseUrl('/');

        return view.render('home', { movies, page: movies.currentPage });
    }

    /**
     * Movie Page
     */
    public async movie({view, params}: HttpContextContract) {
        const movie = await Movie.findByOrFail('movie_slug', params.slug);
        
        return view.render('movie', {movie});
    }

}
