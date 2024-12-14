import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
export default class MemoryIndexRoute extends Route {
    @service database;
    @service auth;
    @tracked dates;
    @tracked title;

  async beforeModel() {
      await this.auth.ensureInitialized();
    }

    async model(params) {
      this.dates = await this.database.getDays(params.trip_id);
      this.title = await this.database.getTripTitle(params.trip_id);
      console.log(this.dates);

      return { trip_id: params.trip_id, dates: this.dates, title: this.title };
    }
}
