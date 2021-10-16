import test from "japa";
import SourcesController from "App/Controllers/Http/SourcesController";
import Movie from "App/Models/Movie";
import Source from "App/Models/Source";
import { data } from "cheerio/lib/api/attributes";
import { logger } from "Config/app";
import LoggerService from "@ioc:Pandavil/LoggerService";
import Database from "@ioc:Adonis/Lucid/Database";
import Log from "App/Models/Log";

test.group("Source", () => {
  test("Can Switch Source", async (assert) => {
    // assert.equal(2 + 2, 4);
    // const source = await Source.find(2);

    // const res = await new SourcesController()
    //   .sourceIsWorking("https://www.bigstacktech.com")
    //   .then((data) => {
    //     return data;
    //   });

    // const res = await new SourcesController()
    //   .autoSourceChecker()
    //   .then((data) => {
    //     return data;
    //   });

    // console.log(res);

    // Dispatch autoChecker Job
    // const res = await new SourcesController().dispatchAutoSourceChecker();
    try {
      await new SourcesController().dispatchMovieUpdate();
    } catch (error) {
      await LoggerService.error("Source error", error, new Log());
    }

    // assert.typeOf(res, "array");
  });
});
