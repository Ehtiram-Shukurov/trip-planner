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
    const activities = await this.database.getActivities(trip_id, date_id);
    var seeActivity = false;
    if (activities.length !== 0) {
      seeActivity = true;
    }
    return {
      date: new Date(day.date.seconds * 1000).toLocaleDateString(),
      date_id: date_id,
      trip_id: trip_id,
      activities: activities,
      seeActivity,
    };
  }
}
