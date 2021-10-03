import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Source from "App/Models/Source";
import Movie from "App/Models/Movie";
import { logger } from "Config/app";
import Logger from "@ioc:Adonis/Core/Logger";

export default class SourcesController {
  public async index({ request, response, view }: HttpContextContract) {
    return response.send({ data: await this.switchSource(1) });
  }

  /**
   * Handle changing of movie sources manually and automatically with
   * failedSource param being the old/previous source and manualSource
   * being the source which the admin intends to change to
   *
   * @param failedSource
   * @param manualSource
   * @returns boolean
   */
  public async switchSource(failedSource?: number, manualSource?: number) {
    try {
      // Handle source switching when active source is supplied
      if (typeof failedSource != undefined) {
        const sources = await Source.query().orderBy("id", "asc");

        // Check sources to see which is functional
        for (const i in sources) {
          let workingSource: number = sources[i]["id"];

          if (
            sources[i]["id"] != failedSource &&
            this.sourceIsWorking(workingSource)
          ) {
            // Method call to change source
            this.switch(failedSource, workingSource);

            // Break loop
            break;
          }
        }
      } else {
        // Method call to change source based on admin request
        this.switch(failedSource, manualSource);
      }

      return true;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }

  /**
   * Implement database update
   * @param failedSource
   * @param workingSource
   */
  private async switch(failedSource?: number, workingSource?: number) {
    // Deactivate old source
    const oldSource = await Source.findOrFail(failedSource);
    oldSource.status = 0;
    await oldSource.save();

    // Activate new source
    const newSource = await Source.findOrFail(workingSource);
    newSource.status = 1;
    await newSource.save();
  }

  public async updateMovieSource(newSource: Source) {
    const movies = await Movie.query()
      .where("source_id", newSource["id"])
      .orderBy("movie_id", "asc");
  }

  /**
   * Checks if a source is working or not
   * @param sourceId
   * @returns boolean
   */
  private sourceIsWorking(sourceId: number) {
    return true;
  }

  private checkIfSourceHasMovie(movieTitle: string) {
    return true;
  }
}
