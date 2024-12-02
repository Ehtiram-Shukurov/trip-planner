import Route from '@ember/routing/route';

export default class AddActivityRoute extends Route {
  async model(params) {
    return { date_id: params.date_id };
  }
}
