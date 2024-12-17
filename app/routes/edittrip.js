import Route from '@ember/routing/route'
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
  
    const days = await this.database.getDays(params.trip_id);


    const dates = days.map((day) => {
      const[m,d,y]= day.date.split('/');
      return new Date(`${y}-${m}-${d}`);
    });

    dates.sort((a, b) => a - b);
    return {
      id: params.trip_id,
      destination: tripData.destination,
      startDate: dates.length && !isNaN(dates[0]) ? dates[0] : null,
      endDate: dates.length && !isNaN(dates[dates.length - 1]) ? dates[dates.length - 1] : null,
      days: tripData.days || {},
    };
  }
}
