import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

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

    this.dates.forEach(async (date) => {
      date.empty =
        (await this.database.getActivities(params.trip_id, date.id)).length === 0;
    });

    this.title = await this.database.getTripTitle(params.trip_id);
    const destination = await this.database.getTripDestination(params.trip_id);

    return {
      trip_id: params.trip_id,
      destination: destination,
      dates: this.dates,
      title: this.title.title,
      setup: this.title.setup,
    };
  }
}
