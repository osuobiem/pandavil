import { JobContract } from "@ioc:Rocketseat/Bull";
import Database from "@ioc:Adonis/Lucid/Database";
import Logger from "@ioc:Adonis/Core/Logger";

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

export default class CreateYear implements JobContract {
  public key = "CreateYear";

  public async handle(job) {
    const { data } = job;

    // Insert new user into the DB when this job is executed
    await Database.insertQuery() // 👈 gives an instance of insert query builder
      .table("movie_years")
      .insert({ year: "2021" });

    return data;
  }

  // Do something when job is complete
  public onCompleted(job, result) {
    Logger.info("Job executed");
  }
}
