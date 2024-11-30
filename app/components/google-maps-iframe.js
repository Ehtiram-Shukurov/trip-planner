import Component from '@glimmer/component';

export default class GoogleMapsIframeComponent extends Component {
  get embedUrl() {
    const apiKey = 'AIzaSyCiObBVhMw70C36XriG71n7aRDjnxyZkPQ'; // Replace with your actual API key
    const query = this.args.query || '0,0';

    if (query === '0,0') {
      return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=0,0&zoom=2&maptype=roadmap`;
    }
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(query)}`;
  }
}
