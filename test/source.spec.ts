import test from "japa";
import SourcesController from "App/Controllers/Http/SourcesController";

test.group("Source", () => {
  test("Can Switch Source", (assert) => {
    // assert.equal(2 + 2, 4);
    new SourcesController().switchSource(1).then((data) => {
      assert.isTrue(false);
    });
  });
});
