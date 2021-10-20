import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SourcesService from '@ioc:Pandavil/SourcesService';
import Sources from "@ioc:Pandavil/SourcesService";
import Movie from 'App/Models/Movie'
import Source from 'App/Models/Source';

export default class MoviesController {

    /**
     * Generate and return download link for netnaija
     */
    public async get_download_link({request, response}: HttpContextContract) {
        
        let download_obj: any = await SourcesService.ping_url(request.input('link'));
        
        response.send(download_obj.data.data.url);
    }

    /**
     * Search movies
     */
    public async search({request, view}: HttpContextContract) {
        const page = request.input('page', 1)
        const keyword: string = request.input('keyword');

        const results: any = await Movie.query().where('title', 'like', '%'+keyword+'%').orderBy('id', 'desc').paginate(page, 18);

        results.baseUrl('/search');
        
        return view.render('search-results', {results, page: results.currentPage, keyword});
    }
}
