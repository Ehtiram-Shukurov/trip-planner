import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class MemoryJournalController extends Controller {
  @service database;
  @service router;
  @service memory;

  @action
  async saveMemory(trip_id, date) {
    console.log(trip_id, date);
   // this.memory.save(trip_id, date);
  }
}
