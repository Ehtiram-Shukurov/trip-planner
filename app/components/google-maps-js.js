import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class GoogleMapsJs extends Component {
  @tracked places = [];
  @tracked selectedLocation = null;
  @tracked suggestion;
  input = null;

  map = null;
  marker = null;
  search = this.args.searchNearby;
  infoWindow = null;

  @action
  async initMap() {
    await customElements.whenDefined('gmp-map');

    this.map = document.querySelector('gmp-map');
    this.marker = document.querySelector('gmp-advanced-marker');
    this.infowindow = new google.maps.InfoWindow();
    const input = document.getElementById('pac-input');
    const autocomplete = new google.maps.places.Autocomplete(input);

    if (this.args.defaultLocation) {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode(
        { address: this.args.defaultLocation },
        (results, status) => {
          if (status === 'OK') {
            this.map.center = results[0].geometry.location;
            this.map.zoom = 17;
            this.marker.position = results[0].geometry.location;
            this.input.value = this.args.defaultLocation;
          } else {
            console.error('Geocode failed: ' + status);
          }
        },
      );
    }

    this.map.innerMap.setOptions({
      mapTypeControl: false,
    });

    autocomplete.addListener('place_changed', () => {
      if (this.infoWindow) {
        this.infoWindow.close();
      }

      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        window.alert('No details available for input: ' + place.name);
        return;
      }

      if (place.geometry.viewport) {
        this.map.innerMap.fitBounds(place.geometry.viewport);
      }

      this.map.center = place.geometry.location;
      this.map.zoom = 17;
      this.marker.position = place.geometry.location;

      this.infowindow.setContent(
        `<strong>${place.name}</strong><br>
         <span>${place.formatted_address}</span>
      `,
      );

      this.infowindow.open(this.map.innerMap, this.marker);

      if (this.args.onPlaceChange) {
        this.selectedLocation = place.formatted_address;
        this.args.onPlaceChange(place.formatted_address);
      }
    });
  }

  @action
  async searchNearby() {
    const overlay = document.getElementById('suggestionOverlay');
    overlay.classList.toggle('d-none');

    this.suggestion = this.selectedLocation;

    const { Place, SearchNearbyRankPreference } =
      await google.maps.importLibrary('places');

    const center = this.map.center;

    const request = {
      fields: ['displayName', 'location', 'businessStatus'],
      locationRestriction: {
        center: center,
        radius: 500,
      },
      includedPrimaryTypes: ['restaurant'],
      maxResultCount: 5,
      rankPreference: SearchNearbyRankPreference.POPULARITY,
      language: 'en-US',
      region: 'us',
    };

    try {
      const { places } = await Place.searchNearby(request);

      if (places.length) {
        this.places = places.map((place) => ({
          displayName: place.displayName,
          location: place.location,
        }));
      } else {
        this.places = [];
      }
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    }
  }

  @action
  async centerMapOnPlace(place) {
    this.suggestion = place.displayName;
    if (this.infowindow) {
      this.infowindow.close();
    }
    this.infoWindow = new google.maps.InfoWindow();

    const formatted = await this.reverseGeocode(
      place.location.lat(),
      place.location.lng(),
    );

    this.map.center = place.location;
    this.map.zoom = 17;
    this.marker.position = place.location;

    this.infowindow.setContent(
      `<strong>${place.displayName}</strong><br>
         <span>${formatted}</span>
      `,
    );

    this.infowindow.open(this.map.innerMap, this.marker);
  }

  @action
  async pickLocation(place) {
    const inputBox = document.getElementById('pac-input');

    this.selectedLocation = place.displayName;
    const formatted = await this.reverseGeocode(
      place.location.lat(),
      place.location.lng(),
    );

    if (this.args.onLocationPick) {
      this.args.onLocationPick(formatted);
    }

    inputBox.value = formatted;
    const overlay = document.getElementById('suggestionOverlay');
    overlay.classList.toggle('d-none');
  }

  @action
  async reverseGeocode(latitude, longitude) {
    const geocoder = new google.maps.Geocoder();

    try {
      const response = await geocoder.geocode({
        location: { lat: latitude, lng: longitude },
      });
      if (response.results && response.results.length > 0) {
        const address = response.results[0].formatted_address;
        this.formattedAddress = address;

        return address;
      } else {
        console.error('No results found for the given coordinates.');
        return null;
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      throw error;
    }
  }

  @action
  toggleOverlay() {
    const overlay = document.getElementById('suggestionOverlay');
    overlay.classList.toggle('d-none');
  }

  @action
  setInput(element) {
    this.input = element; // Assign the DOM element to this.input
    this.input.value = this.args.defaultLocation || ''; // Safely set the value
  }
}
