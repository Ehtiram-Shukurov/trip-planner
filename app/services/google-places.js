import Service from '@ember/service';
import fetch from 'fetch';

export default class GooglePlacesService extends Service {
  GOOGLE_API_KEY = 'AIzaSyCJOJEWNIpSsVDOScXozsAeqV63HmiQwOM';
  END_POINT = 'https://places.googleapis.com/v1/places:searchNearby';
  GEOCODING_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json';

  async fetchNearbyPlaces(location) { 

    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': this.GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.geometry',
    };

    const request  = {
      "includedTypes" : [
        "restaurant",
        "museum",
        "park",
        "zoo",
        "amusement_park",
        "aquarium",
        "art_gallery",
        "bar",
        "hotel",
        "shopping_mall",
        "movie_theater",
        "night_club",
      ],
      "maxResultCount" : 10,
      "locationRestriction":{
        "circle":{
          "center": {
            "latitude": location.lat,
            "longitude": location.lng,
          },
          "radius": 500,
        }
      }
    }
    try{
      const response = await fetch(this.END_POINT, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch nearby places');
      }

      const data = await response.json();
      return data;
    }
    catch(error){
      console.error(error);
    }
  }

  async getCoordinates(location) {
    try {
      const response = await fetch(`${this.GEOCODING_ENDPOINT}?address=${location}&key=${this.GOOGLE_API_KEY}`);
      if (!response.ok) {
        throw new Error('Failed to fetch coordinates');
      }

      const data = await response.json();
      return data.results[0].geometry.location;
    }
    catch(error){
      console.error

    }
  }
}
