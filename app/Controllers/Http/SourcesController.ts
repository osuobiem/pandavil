import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Source from "App/Models/Source";
import { logger } from "Config/app";
import Logger from "@ioc:Adonis/Core/Logger";

import Sources from "@ioc:Pandavil/SourcesService"

export default class SourcesController {
  private currSource: string;

  public async index({ request, response, view }: HttpContextContract) {
    return response.send({ data: await this.switchSource(1) });
  }

  /**
   * Handle changing of movie sources manually and automatically with
   * failedSource param being the old/previous source and manualSource
   * being the source which the admin intends to change to
   *
   * @param oldSource
   * @param newSource
   * @returns boolean
   */
  public async switchSource(oldSource: number, newSource?: number) {
    try {
      // Handle source switching when active source is supplied
      if (typeof newSource == undefined) {
        const sources = await Source.query().orderBy("id", "asc");

        // Check sources to see which is functional
        for (const i in sources) {
          let workingSource: number = sources[i]["id"];

          if(sources[i]["id"] != oldSource && await this.sourceIsWorking(sources[i]['url'])) {
            // Method call to change source
            this.switch(oldSource, workingSource);

            // Break loop
            break;
          }
        }
      } else {
        // Method call to change source based on admin request
        this.switch(oldSource, newSource);
      }

      return true;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }

  /**
   * Implement database update
   * @param oldSource
   * @param newSource
   */
  private async switch(oldSource: number, newSource: number) {
    // Deactivate old source
    const oldSrc = await Source.findOrFail(oldSource);
    oldSrc.status = 0;
    await oldSrc.save();

    // Activate new source
    const newSrc = await Source.findOrFail(newSource);
    newSrc.status = 1;
    await newSrc.save();
  }

  /**
   * Check if source is active
   * @param sourceUrl Source URL
   * @returns true if active, false if otherwise
   */
  private async sourceIsWorking(sourceUrl: string) {
    Sources.ping_url(sourceUrl).then(res => {
      return true;
    })
    .catch(err => {
      return false
    })
  }
}
