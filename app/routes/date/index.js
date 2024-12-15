import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class DateIndexRoute extends Route {
  @service database;
  @service auth;
  @tracked dates;
  @tracked title;

  async beforeModel() {
    await this.auth.ensureLoggedIn();
  }

  async model(params) {
    this.dates = await this.database.getDays(params.trip_id);
    //sort dates by date
    this.dates.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    this.title = await this.database.getTripTitle(params.trip_id);
    return {
      trip_id: params.trip_id,
      dates: this.dates,
      title: this.title,
    };
  }
}
