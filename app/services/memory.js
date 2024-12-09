import Service from "@ember/service";
import {tracked} from "@glimmer/tracking";

export default class MemoryService extends Service {
  @tracked image;
  @tracked journalEntry;

  setImage(file) {
    this.image = file;
  }

  save(tripId, date) {
    // save image
    // save journal entry
  }
}

