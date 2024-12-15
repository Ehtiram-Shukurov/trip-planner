import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { action } from '@ember/object';
import fetch from 'fetch';

export default class DestinationsController extends Controller {
  @service router;
  @service database;

  @tracked destinationQuery = '';
  @tracked selectedDestination = '';

  GOOGLE_API_KEY = 'AIzaSyCiObBVhMw70C36XriG71n7aRDjnxyZkPQ';

  @action
  updateDestination(value) {
    this.selectedDestination = value;
  }

  @action
  async searchQuery() {
    this.destinationQuery = document.querySelector('#search').value;

    if (!this.destinationQuery) {
      alert('Please enter a destination');
      return false;
    }

    const query = this.destinationQuery.trim();

    if (query === '') {
      alert('Please enter a destination');
      return false;
    }

    const apiURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${this.GOOGLE_API_KEY}`;

    try {
      const response = await fetch(apiURL);
      const data = await response.json();

      if (data.status === 'OK') {
        const res = data.results[0];
        const allowedTypes = [
          'country',
          'administrative_area_level_1',
          'locality',
        ];

        const isValid = res.types.some((type) => allowedTypes.includes(type));

        if (isValid) {
          this.selectedDestination = res.formatted_address;
          return true;
        } else {
          alert(
            'Only countries, regions, or cities are allowed. Please try again.',
          );
          this.destinationQuery = '';
          document.querySelector('#search').value = '';
          return false;
        }
      } else {
        alert(
          'Location not found. Please enter a valid country, region, or city.',
        );
        this.destinationQuery = '';
        document.querySelector('#search').value = '';
        return false;
      }
    } catch (error) {
      console.error('Error with Google Maps Embed API: ', error);
      return false;
    }
  }

  @action
  async validateAndNavigate() {
    let isValid;
    if (!this.selectedDestination) {
      isValid = await this.searchQuery();
      if (!isValid) {
        return;
      }
    }

    await this.database.setDestination(this.model, this.selectedDestination);
    this.router.transitionTo('date-picker', this.model);
  }

  @action
  cancel() {
    this.database.deleteTrip(this.model);
    this.router.transitionTo('home');
  }
}
