import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { htmlSafe } from '@ember/template';

export default class IndexDateController extends Controller {
  @service database;
  @service router;

  @action
  async saveTitle() {
    let title = document.getElementById('title').innerText;
    await this.database.saveTripTitle(this.model.trip_id, title);
  }

  @action
  async saveAndNavigate() {
    await this.database.finishSetup(this.model.trip_id);
    this.router.transitionTo('home');
  }

  getAnimationDelay(index) {
    const delay = index * 0.1; // Calculate delay based on index
    return htmlSafe(`animation-delay: ${delay}s;`);
  }
}
