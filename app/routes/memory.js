import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MemoryRoute extends Route {
  @service auth;
  async beforeModel() {
    await this.auth.ensureLoggedIn();
  }
  async model(params) {
    // This route was generated with a dynamic segment. Implement data loading
    // based on that dynamic segment here in the model hook.
    return params;
  }
}
