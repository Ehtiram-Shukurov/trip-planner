import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import {tracked} from "@glimmer/tracking";

export default class MemoryJournalController extends Controller {
  @service database;
  @service router;
  @service memory;
  @tracked images = this.model.images;

  @action
  async saveMemory(trip_id, date_id, journal) {
    this.memory.save(trip_id, date_id);
    this.router.transitionTo('memory', trip_id);
    await this.database.saveJournal(trip_id, date_id, journal);
  }

  @action
  async deleteImage(trip_id, date_id, image_index) {
    await this.database.deleteImage(trip_id, date_id, image_index);
    this.images = await this.database.getImages(trip_id, date_id);
  }
}
