import test from "japa";
import SourcesController from "App/Controllers/Http/SourcesController";
import Movie from "App/Models/Movie";
import Source from "App/Models/Source";
import { data } from "cheerio/lib/api/attributes";

test.group("Source", () => {
  test("Can Switch Source", async (assert) => {
    // assert.equal(2 + 2, 4);
    // const source = await Source.find(2);

    // const res = await new SourcesController()
    //   .sourceIsWorking("https://www.bigstacktech.com")
    //   .then((data) => {
    //     return data;
    //   });

    const res = await new SourcesController()
      .autoSourceChecker()
      .then((data) => {
        return data;
      });

    console.log(res);

    // assert.typeOf(res, "array");
  });
});
