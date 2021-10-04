import test from "japa";
import SourcesController from "App/Controllers/Http/SourcesController";
import Movie from "App/Models/Movie";
import Source from "App/Models/Source";

test.group("Source", () => {
  test("Can Switch Source", async (assert) => {
    // assert.equal(2 + 2, 4);
    const source = await Source.find(2);

    await new SourcesController().updateFailedSourceMovie(1, source);

    // console.log(res);

    // assert.typeOf(res, "array");
  });
});
