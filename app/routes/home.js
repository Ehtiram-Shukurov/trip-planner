import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class HomeRoute extends Route {
  @service auth;
  @service database;

  async beforeModel(_transition) {
    await this.auth.ensureLoggedIn();
  }

  async model() {
    return await this.database.getUserTrips();
  }
}
