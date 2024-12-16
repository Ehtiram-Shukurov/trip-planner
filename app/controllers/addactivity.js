import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class AddActivityController extends Controller {
  @service router;
  @service database;

  @tracked time = '';
  @tracked budget = '';
  @tracked location = '';

  @action
  updateLocation(location) {
    this.location = location;
  }

  @action
  updateTime(event) {
    this.time = event.target.value;
  }

  @action
  updateBudget(event) {
    this.budget = event.target.value;
  }

  @action
  async saveActivity(event) {
    event.preventDefault();
    if (!this.time) {
      alert('Please select a time');
      return;
    }
    if (!this.budget) {
      alert('Please select a budget');
      return;
    }
    if (!this.location) {
      alert('Please select a location');
      return;
    }

    const newActivity = {
      time: this.time,
      budget: this.budget,
      location: this.location,
      journal: '',
    };

    await this.database.addActivity(
      this.model.trip_id,
      this.model.date_id,
      newActivity,
    );

    this.router.transitionTo(
      'date.detail',
      this.model.trip_id,
      this.model.date_id,
    );
  }
}
