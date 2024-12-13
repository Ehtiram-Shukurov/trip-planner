import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class DateDetailRoute extends Route {
  @service auth;
  @service database;

  async beforeModel(params) {
    await this.auth.ensureLoggedIn();
  }

  async model(params) {
    const { trip_id, date_id } = params;
    const day = await this.database.getDay(trip_id, date_id);
    const activities = await this.database.getActivities(trip_id, date_id);

    console.log(day);
    console.log(activities);

    return {
      date: day.date,
      date_id: date_id,
      trip_id: trip_id,
      activities: activities,
    };
  }
}
