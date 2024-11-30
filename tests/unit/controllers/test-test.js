import { module, test } from 'qunit';
import { setupTest } from 'project-2-big-chungus/tests/helpers';

module('Unit | Controller | test', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:test');
    assert.ok(controller);
  });
});
