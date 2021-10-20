import LoggerService from '@ioc:Pandavil/LoggerService';
import SourcesService from '@ioc:Pandavil/SourcesService';
import { JobContract } from '@ioc:Rocketseat/Bull'
import Log from 'App/Models/Log';
import Movie from 'App/Models/Movie';

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
      
      await Movie.createMany(await SourcesService.netnaija(data.source, Movie));

      await LoggerService.info(
        "MovieUpdate Job Run",
        "Movie Update Successful",
        new Log()
      );
    } catch (error) {
      await LoggerService.error("MovieUpdate Job Error", error, new Log());
    }
  }
}
