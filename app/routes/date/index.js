import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';

export default class DateIndexRoute extends Route {
  @tracked dates;
  model() {
    //TODO: replace this with actual data later
    //randomly generate 5 dates
    this.dates = [];

    for (let i = 0; i < 5; i++) {
      let date = new Date();
      date.setDate(date.getDate() + i);
      date = date.toLocaleDateString();
      this.dates.push(date);
    }

    return this.dates;
  }
}
