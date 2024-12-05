import Route from '@ember/routing/route';

export default class DatePickerRoute extends Route {
  beforeModel() {}

  model(params) {
    return params.trip_id;
  }
}
