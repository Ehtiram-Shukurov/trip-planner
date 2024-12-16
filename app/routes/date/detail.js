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

    //sort activities by start time
    activities.sort((a, b) => {
      const timeA = a.data.time;
      const timeB = b.data.time; 

      const [hourA, minuteA] = timeA.split(':').map(Number);
      const [hourB, minuteB] = timeB.split(':').map(Number);

      return hourA - hourB || minuteA - minuteB;
    });

    //change the display of large number budget
    activities.forEach((activity) => {
      const budget = activity.data.budget;
      if (budget >= 1000000) {
        activity.data.budget= `${(budget / 1000000).toFixed(1)}M`;
      } else if (budget >= 1000) {
        activity.data.budget= `${(budget / 1000).toFixed(1)}K`;
      }
      else {
        activity.data.budget= `${budget}`;
      }
    });

    return {
      date: new Date(day.date).toLocaleDateString("en-US"),
      date_id: date_id,
      trip_id: trip_id,
      activities: activities,
    };
  }
}
