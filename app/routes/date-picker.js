import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class DatePickerRoute extends Route {
  @service auth;
  async beforeModel() {
    await this.auth.ensureLoggedIn();
  }
  async model(params) {
    return params.trip_id;
  }
}
