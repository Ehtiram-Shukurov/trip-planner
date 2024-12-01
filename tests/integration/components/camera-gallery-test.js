import { module, test } from 'qunit';
import { setupRenderingTest } from 'project-2-big-chungus/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | camera-gallery', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<CameraGallery />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <CameraGallery>
        template block text
      </CameraGallery>
    `);

    assert.dom().hasText('template block text');
  });
});
