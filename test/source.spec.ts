import test from "japa";
import SourcesController from "App/Controllers/Http/SourcesController";

test.group("Source", () => {
  test("Can Switch Source", (assert) => {
    // assert.equal(2 + 2, 4);
    assert.isFalse(new SourcesController().switchSource());
  });
});
