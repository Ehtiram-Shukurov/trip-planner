import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { action } from '@ember/object';
import fetch from 'fetch';

export default class DestinationsController extends Controller {
  @service database;

  @tracked destinationQuery = '';
  @tracked selectedDestination = '';
  @tracked errorMessage = '';

  GOOGLE_API_KEY = 'AIzaSyCiObBVhMw70C36XriG71n7aRDjnxyZkPQ';

  @action
  async searchQuery() {
    this.destinationQuery = document.querySelector('#search').value;
    const query = this.destinationQuery.trim();

    if (query === '') {
      alert('Please enter a destination');
      return;
    }

    const apiURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${this.GOOGLE_API_KEY}`;

    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      console.log('Geocoding API Response:', data);
      console.log(data.status);

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
          this.errorMessage = '';
        } else {
          alert(
            'Only countries, regions, or cities are allowed. Please try again.',
          );
          // this.destinationQuery = '';
        }
      } else {
        alert(
          'Location not found. Please enter a valid country, region, or city.',
        );
      }
    } catch (error) {
      console.error('Error with Google Maps Embed API: ', error);
    }
  }
  @action
  async saveDestination() {
    await this.database.setDestination(this.model, this.selectedDestination);
  }
}
