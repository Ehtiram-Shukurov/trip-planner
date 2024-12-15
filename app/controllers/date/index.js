import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class IndexDateController extends Controller {
  @service database;
  @service router;
  
  @action
  async saveTitle() {
    let title = document.getElementById('title').innerText;
    console.log(title);
    await this.database.saveTripTitle(this.model.trip_id, title);
  }

  @action
  async saveAndNavigate() {
    await this.database.finishSetup(this.model.trip_id);
    this.router.transitionTo('home');
  }
}
