import { module, test } from 'qunit';
import { setupRenderingTest } from 'project-2-big-chungus/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | google-maps-js', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<GoogleMapsJs />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <GoogleMapsJs>
        template block text
      </GoogleMapsJs>
    `);

    assert.dom().hasText('template block text');
  });
});
