import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AddActivityRoute extends Route {
  @service auth;
  async beforeModel() {
    await this.auth.ensureLoggedIn();
  }

  async model(params) {
    return { trip_id: params.trip_id, date_id: params.date_id };
  }
}
