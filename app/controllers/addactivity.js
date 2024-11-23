import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class AddactivityController extends Controller {
  @tracked time = '';
  @tracked budget = '';
  @tracked location = '';

  @action
  updateTime(event) {
    this.time = event.target.value;
  }

  @action
  updateBudget(event) {
    this.budget = event.target.value;
  }

  @action
  updateLocation(event) {
    this.location = event.target.value;
  }

  @action
  saveActivity(event) {
    event.preventDefault();

    const newActivity = {
      time: this.time,
      budget: this.budget,
      location: this.location,
    };

    //TODO Saving part

    // Redirect back to the day route
    this.RouterService.transitionTo('day', this.model.date_id);
  }
}
