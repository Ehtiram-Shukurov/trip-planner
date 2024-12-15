import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class GoogleMapsJs extends Component {
  @tracked places = [];
  @tracked selectedLocation = null;

  map = null;
  marker = null;
  search = this.args.searchNearby;
  infoWindow = null;

  @action
  async initMap() {
    await customElements.whenDefined('gmp-map');

    this.map = document.querySelector('gmp-map');
    this.marker = document.querySelector('gmp-advanced-marker');
    const placePicker = document.querySelector('gmpx-place-picker');
    this.infowindow = new google.maps.InfoWindow();

    if (this.args.defaultLocation) {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode(
        { address: this.args.defaultLocation },
        (results, status) => {
          if (status === 'OK') {
            this.map.center = results[0].geometry.location;
            this.map.zoom = 17;
            this.marker.position = results[0].geometry.location;
            placePicker.value = {
              location: results[0].geometry.location,
              formattedAddress: this.args.defaultLocation,
              displayName: this.args.defaultLocation,
            };
          } else {
            console.error('Geocode failed: ' + status);
          }
        },
      );
    }

    this.map.innerMap.setOptions({
      mapTypeControl: false,
    });

    placePicker.addEventListener('gmpx-placechange', () => {
      const place = placePicker.value;

      if (!place.location) {
        window.alert("No details available for input: '" + place.name + "'");
        this.infowindow.close();
        this.marker.position = null;
        return;
      }

      if (place.viewport) {
        this.map.innerMap.fitBounds(place.viewport);
      } else {
        this.map.center = place.location;
        this.map.zoom = 17;
      }

      this.marker.position = place.location;
      this.infowindow.setContent(
        `<strong>${place.displayName}</strong><br>
         <span>${place.formattedAddress}</span>
      `,
      );

      this.infowindow.open(this.map.innerMap, this.marker);

      if (this.args.onPlaceChange) {
        this.selectedLocation = place.formattedAddress;
        this.args.onPlaceChange(place.formattedAddress);
      }
    });
  }

  @action
  async searchNearby() {
    console.log('triggerd searchNearyby');
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
        console.log('No results');
        this.places = [];
      }
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    }
  }

  @action
  async centerMapOnPlace(place) {
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
    const placePicker = document.querySelector('gmpx-place-picker');
    console.log(placePicker.value);

    this.selectedLocation = place.displayName;
    const formatted = await this.reverseGeocode(
      place.location.lat(),
      place.location.lng(),
    );

    if (this.args.onLocationPick) {
      this.args.onLocationPick(formatted);
    }
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

        console.log('Formatted Address:', address);
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
}
