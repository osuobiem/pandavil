import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SourcesService from '@ioc:Pandavil/SourcesService';
import Sources from "@ioc:Pandavil/SourcesService";
import Movie from 'App/Models/Movie'
import Source from 'App/Models/Source';

export default class MoviesController {

    /**
     * Fetch movies from source and save to the DB
     */
    public async fetch_movies({request, response, view}: HttpContextContract) {
        let source = await Source.findBy('method_name', 'netnaija');

        await Movie.createMany(await Sources.netnaija(source, Movie));

        response.send('<h2>Done</h2>');
    }

    /**
     * Generate and return download link for netnaija
     */
    public async get_download_link({request, response, params}: HttpContextContract) {
        
        let download_obj: any = await SourcesService.ping_url(request.input('link'));
        
        response.send(download_obj.data.data.url);
    }
}
