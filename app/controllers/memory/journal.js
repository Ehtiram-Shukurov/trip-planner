import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class MemoryJournalController extends Controller {
  @service database;
  @service router;
  @service memory;

  @action
  async saveMemory(trip_id, date_id, journal) {
    this.memory.save(trip_id, date_id);
    this.router.transitionTo('memory', trip_id);
    await this.database.saveJournal(trip_id, date_id, journal);
  }
}
