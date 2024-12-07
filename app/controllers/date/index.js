import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class DateIndexController extends Controller {
  @service database;

  @action
  async finishSetup() {
    await this.database.finishSetup(this.model.trip_id);
  }
  
}
