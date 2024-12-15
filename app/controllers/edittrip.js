import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import fetch from 'fetch';

export default class EditTripController extends Controller {
  @service database;
  @service router;

  @tracked destination = '';
  @tracked startDate = null;
  @tracked endDate = null;
  @tracked dates = [];
  @tracked litepicker;

  GOOGLE_API_KEY = 'AIzaSyCiObBVhMw70C36XriG71n7aRDjnxyZkPQ';

  constructor() {
    super(...arguments);
    window.addEventListener('resize', this.handleResize);
  }

  @action
  initializeFields() {
    if (this.model) {
      this.destination = this.model.destination || '';
      this.startDate = this.model.startDate ? new Date(this.model.startDate) : null;
      this.endDate = this.model.endDate ? new Date(this.model.endDate) : null;

      this.dates = [];
      if (this.startDate && this.endDate) {
        let currentDate = new Date(this.startDate);
        while (currentDate <= this.endDate) {
          this.dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    }
  }

  @action
  registerAPI(litepicker) {
    this.litepicker = litepicker;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.litepicker.setOptions({
      minDate: today,
    });

    if (this.startDate && this.endDate) {
      this.litepicker.setDateRange(
        this.startDate.toISOString().split('T')[0],
        this.endDate.toISOString().split('T')[0]
      );
    }
  }

  @action
  onDateChanged(startDate, endDate) {
      this.startDate = startDate.dateInstance;
      this.endDate = endDate.dateInstance;

      this.dates = [];
      let currentDate = new Date(this.startDate);
      while (currentDate <= this.endDate) {
        this.dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

  @action
  async searchDestination() {
    const query = this.destination.trim();

    if (!query) {
      alert('Please enter a destination');
      return;
    }

    const apiURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      query,
    )}&key=${this.GOOGLE_API_KEY}`;

    try {
      const response = await fetch(apiURL);
      const data = await response.json();

      if (data.status === 'OK') {
        const res = data.results[0];
        this.destination = res.formatted_address;
      } else {
        alert('Location not found. Please enter a valid destination.');
      }
    } catch (error) {
      console.error('Error with Google Maps Embed API: ', error);
    }
  }

  @action
  async saveChanges(event) {
    event.preventDefault();

    if (!this.destination) {
      alert('Please select a destination');
      return;
    }

    if (!this.startDate || !this.endDate) {
      alert('Please select a valid date range');
      return;
    }

  try {
    const updatedTrip = {
      destination: this.destination,
      lastEdited: new Date().getTime(),
    };
    await this.database.updateTrip(this.model.id, updatedTrip);
    await this.database.addDays(this.startDate, this.endDate, this.model.id);
  
    this.router.transitionTo('home');
  } catch (error) {
    alert('Failed to save changes. Please try again.');
  }
}

  @action
  updateDestination(value) {
    this.destination = value;
  }
}
