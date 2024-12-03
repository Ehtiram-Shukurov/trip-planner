import Route from '@ember/routing/route';

export default class DatePickerRoute extends Route {
  beoforeModel() {}

  model(params) {
    return params.trip_id;
  }
  
}
