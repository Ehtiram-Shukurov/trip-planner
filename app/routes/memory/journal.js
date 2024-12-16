import Route from '@ember/routing/route';
import { service } from '@ember/service';
import {tracked} from "@glimmer/tracking";

export default class MemoryJournalRoute extends Route {
  @service auth;
  @service database;
  @tracked journal = '';
  @tracked images;

  async beforeModel(params) {
    await this.auth.ensureInitialized();
  }

  async model(params) {
    const { trip_id, date_id } = params;
    const day = await this.database.getDay(trip_id, date_id);
    this.journal = await this.database.getJournal(trip_id, date_id);
    this.images = await this.database.getImages(trip_id, date_id);

    return {
      date: new Date(day.date).toLocaleDateString("en-US"),
      date_id: date_id,
      trip_id: trip_id,
      journal: this.journal,
      images: this.images,
    };
  }
}
