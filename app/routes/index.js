import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service router;
  @service auth;
  @service database;

  async beforeModel() {
    await this.auth.ensureInitialized();
    if (this.auth.user) {
      this.router.transitionTo('home');
    }
  }

  async model() {}
}
