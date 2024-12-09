import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import {tracked} from "@glimmer/tracking";

export default class MemoryJournalController extends Controller {
  @service database;
  @service router;
  @service memory;

  @action
  async saveMemory() {
    this.memory.save();
  }

  setImage(image) {
    this.image = image;
  }
}
