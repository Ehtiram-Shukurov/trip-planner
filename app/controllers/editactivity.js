import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class EditActivityController extends Controller {
  @service router;
  @service database;

  @tracked time = '';
  @tracked budget = '';
  @tracked location = '';

  @action
  initializeFields() {
    if (this.model.activity) {
      this.time = this.model.activity.time || '';
      this.budget = this.model.activity.budget || '';
      this.location = this.model.activity.location || '';
    }
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
  updateLocation(value) {
    this.location = value;
  }

  @action
  async saveActivity(event) {
    event.preventDefault();
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

    const updatedActivity = {
      time: this.time,
      budget: this.budget,
      location: this.location,
    };

    await this.database.editActivity(
      this.model.trip_id,
      this.model.date_id,
      this.model.activity_id,
      updatedActivity,
    );

    this.router.transitionTo(
      'date.detail',
      this.model.trip_id,
      this.model.date_id,
    );
  }
}
