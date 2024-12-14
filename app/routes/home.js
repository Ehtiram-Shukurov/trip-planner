import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class HomeRoute extends Route {
  @service auth;
  @service database;

  async beforeModel(_transition) {
    await this.auth.ensureLoggedIn();
  }

  async model() {
    const trips = await this.database.getUserTrips();
    const currentTime = Date.now();
    //TOODO loop through trips and grab the first date in the trip
    // checks if the time for the first date and first activity has expired
    for(let key in trips)
    {
      if(!trips[key].start)
      {
        let firstDay = trips[key].days.day1.date;
        let epochTime = new Date(firstDay).getTime();
        if (epochTime < currentTime)
        {
          await this.database.startTrip(trips[key].id)
        }
      }
      // not complete trip
      // bug in the code where the lastday return value is dependent on code refresh
      // if the refresh is too fast the code will return the first element instead
      // of the last element
      if(!trips[key].complete)
      {
        let data = Object.keys(trips[key].days);
        let dataValues = Object.values(data);
        let dataKeys = Object.keys(data);
        let lastKey = dataKeys.length -1;
        let lastActivty = dataValues[lastKey];
        let lastDay =trips[key].days[lastActivty].date;
        console.log(lastDay);
      }
    }


    return trips;
  }
}
