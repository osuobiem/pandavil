import { JobContract } from "@ioc:Rocketseat/Bull";
import { logger } from "Config/app";
import Logger from "@ioc:Adonis/Core/Logger";
import SourcesController from "App/Controllers/Http/SourcesController";

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

export default class AutoSourceChecker implements JobContract {
  public key = "AutoSourceChecker";

  public async handle(job) {
    const { data } = job;

    try {
      Logger.info(await new SourcesController().autoSourceChecker());
    } catch (error) {
      Logger.error(error);
    }
  }
}
