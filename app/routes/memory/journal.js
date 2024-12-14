import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MemoryJournalRoute extends Route {
    @service auth;
    @service database;

    async beforeModel(params) {
      await this.auth.ensureInitialized();
    }

    async model(params) {
      const { trip_id, date_id } = params;
      const day = await this.database.getDay(trip_id, date_id);
      var seeActivity = false;
      if (day.activities.length !== 0) {
        seeActivity = true;
      }
      return {
        date: day.date,
        date_id: date_id,
        trip_id: trip_id,
        activities: day.activities,
        seeActivity,
      };
    }
}
