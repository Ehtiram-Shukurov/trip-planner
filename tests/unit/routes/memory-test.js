import { module, test } from 'qunit';
import { setupTest } from 'project-2-big-chungus/tests/helpers';

module('Unit | Route | memory', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:memory');
    assert.ok(route);
  });
});
