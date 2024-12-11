import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class GoogleMapsJs extends Component {
  @action
  async initMap() {
    await customElements.whenDefined('gmp-map');

    const map = document.querySelector('gmp-map');
    const marker = document.querySelector('gmp-advanced-marker');
    const placePicker = document.querySelector('gmpx-place-picker');
    const infowindow = new google.maps.InfoWindow();

    if (this.args.defaultLocation) {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({address: this.args.defaultLocation}, (results, status) => {
        if (status === 'OK') {
          map.center = results[0].geometry.location;
          map.zoom = 17;
          marker.position = results[0].geometry.location;
          placePicker.value = {
            location: results[0].geometry.location,
            formattedAddress: this.args.defaultLocation,
            displayName: this.args.defaultLocation
          };
        }
        else {
          console.error('Geocode was broken: ' + status);
        }
      });

    }

    map.innerMap.setOptions({
      mapTypeControl: false
    });

    placePicker.addEventListener('gmpx-placechange', () => {
      const place = placePicker.value;

      if (!place.location) {
        window.alert(
          "No details available for input: '" + place.name + "'"
        );
        infowindow.close();
        marker.position = null;
        return;
      }

      if (place.viewport) {
        map.innerMap.fitBounds(place.viewport);
      } else {
        map.center = place.location;
        map.zoom = 17;
      }

      marker.position = place.location;
      infowindow.setContent(
        `<strong>${place.displayName}</strong><br>
         <span>${place.formattedAddress}</span>
      `);

      infowindow.open(map.innerMap, marker);

      // Pass the updated place to the parent via the provided action
      if (this.args.onPlaceChange) {
        this.args.onPlaceChange(place.formattedAddress);
      }
    });
  }
}
