import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class DateIndexRoute extends Route {
  @service database;
  @service auth;
  @tracked dates;

  async beforeModel() {
    await this.auth.ensureInitialized();
  }

  async model(params) {
    //TODO: replace this with actual data later
    //randomly generate 5 dates
    this.dates = await this.database.getDays(params.trip_id);
    return { trip_id: params.trip_id, dates: Object.values(this.dates) };
  }
}
