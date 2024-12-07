import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class DateIndexRoute extends Route {
  @service database;
  @service auth;
  @tracked dates;

  async beforeModel() {
    await this.auth.ensureLoggedIn();
  }

  async model(params) {
    this.dates = await this.database.getDays(params.trip_id);
    return { trip_id: params.trip_id, dates: Object.values(this.dates) };
  }
}
