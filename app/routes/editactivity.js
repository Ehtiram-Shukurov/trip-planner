import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class EditActivityRoute extends Route {
  @service database;
  @service auth;

  async beforeModel() {
    await this.auth.ensureLoggedIn();
  }
  async model(params) {
    const { trip_id, date_id, activity_id } = params;

    if (!trip_id || !date_id || activity_id === undefined) {
      throw new Error('Missing route parameters');
    }
    const activity = await this.database.getActivity(
      trip_id,
      date_id,
      activity_id,
    );

    if (!activity) {
      throw new Error('Activity not found');
    }

    return {
      trip_id,
      date_id,
      activity_id,
      activity,
    };
  }
}
