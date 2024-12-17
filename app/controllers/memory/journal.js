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
  async saveMemory(trip_id, date_id) {
    await this.memory.save(trip_id, date_id);
    const journal = this.model.journal? this.model.journal : '';
    await this.database.saveJournal(trip_id, date_id, journal);
    this.router.refresh();
  }

  @action
  async deleteImage(trip_id, date_id, image_index) {
    await this.database.deleteImage(trip_id, date_id, image_index);
    this.images = await this.database.getImages(trip_id, date_id);
    this.router.refresh();
  }

  @action
  updateJournal(event) {
    this.model.journal = event.target.value;
    console.log(this.model.journal);
  }

}
