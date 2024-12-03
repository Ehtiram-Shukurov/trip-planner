import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service router;
  @service auth;
  @service database;

  async beforeModel() {
    await this.auth.ensureInitialized();
  }

  async model() {
    const trips = await this.database.getUserTrips();
    return trips;
  }
}
