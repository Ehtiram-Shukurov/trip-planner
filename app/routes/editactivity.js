import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class EditActivityRoute extends Route {
  @service database;
  @service auth;

  async beforeModel(){
    await this.auth.ensureLoggedIn();
  }

  async model(params) {
    const { trip_id, date_id, activityIndex } = params;

    if (!trip_id || !date_id || activityIndex === undefined) {
      throw new Error('Missing route parameters');
    }

    const day = await this.database.getDay(trip_id, parseInt(date_id, 10));
    const activity = day.activities[parseInt(activityIndex, 10)];

    if (!activity) {
      throw new Error('Activity not found');
    }

    return {
      trip_id,
      date_id,
      activityIndex: parseInt(activityIndex, 10),
      activity,
    };
  }
}
