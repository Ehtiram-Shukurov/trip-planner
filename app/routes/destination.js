import Route from '@ember/routing/route';

export default class DestinationRoute extends Route {
  model(params) {
    return params.trip_id;
  }
}
