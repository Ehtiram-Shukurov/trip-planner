import { module, test } from 'qunit';
import { setupTest } from 'project-2-big-chungus/tests/helpers';

module('Unit | Controller | addactivity', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:addactivity');
    assert.ok(controller);
  });
});
