import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { getDoc } from 'firebase/firestore';

export default class EditTripRoute extends Route {
  @service auth;
  @service database;

  async beforeModel() {
    await this.auth.ensureLoggedIn();
    if (!this.auth.user) {
      throw new Error('User is not authenticated.');
    }
  }

  async model(params) {
    const tripDoc = await this.database.getTrip(params.trip_id);
    const tripSnapshot = await getDoc(tripDoc);

    if (!tripSnapshot.exists()) {
      throw new Error(`Trip with ID ${params.trip_id} does not exist.`);
    }

    const tripData = tripSnapshot.data();

    const days = Object.values(tripData.days || {}).map((day) => new Date(day.date));
    days.sort((a, b) => a - b);

    return {
      id: params.trip_id,
      destination: tripData.destination,
      startDate: days.length ? days[0] : null,
      endDate: days.length ? days[days.length - 1] : null,
      days: tripData.days || {},
    };
  }
}
