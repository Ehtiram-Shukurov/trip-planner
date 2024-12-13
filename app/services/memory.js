import Service, {service} from "@ember/service";

export default class Memory extends Service {
  @service database;
  images = [];
  journalEntry;

  setImages(files) {
    this.images = files;
  }

  save(trip_id, date_id) {
    // save images
    this.images.forEach(async (image) => {
      await this.database.saveImage(image, trip_id, date_id);
    })
    // save journal entry
    //this.database.saveJournalEntry(this.journalEntry, tripId, dateId);

    // reset images and journal entry
    this.images = [];
    this.journalEntry = '';
  }
}

