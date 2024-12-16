import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
export default class MemoryIndexRoute extends Route {
  @service database;
  @service auth;
  @tracked dates;
  @tracked title;

  async beforeModel() {
    await this.auth.ensureLoggedIn();
  }

    async model(params) {
      this.dates = await this.database.getDays(params.trip_id);
      this.title = await this.database.getTripTitle(params.trip_id);
      this.dates.sort((a, b) => new Date(a.date) - new Date(b.date));

    return { trip_id: params.trip_id, dates: this.dates, title: this.title.title };
  }
}
