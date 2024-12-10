import Service, {service} from "@ember/service";

export default class Memory extends Service {
  @service database;
  images = [];
  journalEntry;

  setImage(file) {
    this.images.push(file);
  }

  save(tripId, date) {
    // save images
    this.images.forEach(async (image) => {
      this.database.saveImage(image, tripId, date);
    })
    // save journal entry
    this.database.saveJournalEntry(this.journalEntry, tripId, date);

    // reset images and journal entry
    this.images = [];
    this.journalEntry = '';
  }
}

