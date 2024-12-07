import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ResultRoute extends Route {
  @service auth;
  async beforeModel() {
    await this.auth.ensureLoggedIn();
  }
}
