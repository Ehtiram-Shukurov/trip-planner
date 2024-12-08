import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class IndexDateController extends Controller {
  @service database;
  @service router;
  @action
  async saveAndNavigate() {
    let title = document.getElementById('title');
    await this.database.saveTripTitle(this.model.trip_id, title.innerText);
    this.router.transitionTo('home');
  }
}
